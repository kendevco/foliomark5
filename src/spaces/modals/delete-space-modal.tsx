'use client';
import axios from "axios";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import { useModal } from "@/spaces/hooks/use-modal-store";
import { Button } from "../../ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ModalType } from '@/spaces/collections/types';


export const DeleteSpaceModal = () => {

    const { onOpen, isOpen, onClose, type, data } = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === ModalType.DELETE_SPACE;

    const { space } = data;

    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/spaces/${space?.id}`);

            onClose();
            router.refresh();
            router.push("/")
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }

    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden mx-4">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">Delete Space</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this space? <span
                            className="font-semibold text-indigo-500"
                        >{space?.name}</span> will be permanently deleted.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter
                    className="bg-gray-100 px-6 py-4"
                >
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={isLoading}
                            onClick={onClose}
                            variant="ghost"
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            onClick={onClick}
                            variant="primary"
                        >
                            Confirm
                        </Button>
                    </div>

                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}

