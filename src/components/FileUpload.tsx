'use client'
import { uploadToS3 } from "@/lib/s3";
import { Inbox, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from '@tanstack/react-query';
import axios from "axios";
import {useRouter} from "next/navigation";
import { toast } from 'react-hot-toast'

const FileUpload = () => {
    const router = useRouter();
    const [uploading, setUploading] = useState(false);
    const { mutate, isLoading } = useMutation({
        mutationFn: async ({
            file_key, file_name
        }: {
            file_key: string;
            file_name: string;
        }) => {
            const response = await axios.post('/api/create-chat', { file_key, file_name });
            console.log('upload response', response.data);
            return response.data;
        }
    })
    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'application/pdf': [".pdf"] },
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            //console.log(acceptedFiles);
            const file = acceptedFiles[0];
            if (file.size > 10 * 1024 * 1024) {
                toast.error("Please upload a smaller file");
                return;
            }

            try {
                setUploading(true);
                const data = await uploadToS3(file);
                if (!data?.file_key || !data.file_name) {
                    return;
                }
                mutate(data, {
                    onSuccess: ({chat_id}) => {
                        toast.success("Chat created!");
                        router.push(`/chat/${chat_id}`);
                    },
                    onError: err => {
                        console.error(err);
                        toast.error("Error creating toast");
                    }
                });
            } catch (error) {
                console.log(error);
                toast.error("Error uploading to S3");
            } finally {
                setUploading(false);
            }
        },
    });
    return (
        <div className="p-2 bg-white rounded-xl ">
            <div {...getRootProps({
                className: 'border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col'
            })}>
                <input {...getInputProps()} />
                {(uploading || isLoading) ? (
                <>
                {/*loading state */}
                <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                <p className="mt-2 text-sm text-slate-400">Sending Doc to GPT</p>
                </>
                ) : (
                    <>
                        <Inbox className="w-10 h-10 text-blue-500" />
                        <p className="mt-2 text-sm text-slate-400">Drop PDF here</p>
                    </>)}
            </div>
        </div>
    )
}

export default FileUpload