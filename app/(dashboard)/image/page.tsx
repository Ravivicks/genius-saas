"use client";

import Heading from "@/components/heading";
import { Download, ImageIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { formSchema } from "../conversation/constants";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/loader";
import Empty from "@/components/empty";
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import axios from "axios";
import { useProModal } from "@/hooks/use-pro-model";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const TextToImageComponent: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { onOpen } = useProModal();
  const router = useRouter();
  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const { control, handleSubmit, formState } = formMethods;

  const handleGenerateImage = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("prompt", values.prompt);

    try {
      const response = await axios.post("/api/monster", formData, {
        responseType: "blob",
      });

      if (response.status === 200) {
        const imageBlob = response.data;
        const imageUrl = URL.createObjectURL(imageBlob);
        setImageUrl(imageUrl);
      }
    } catch (error: any) {
      if (error?.response?.status === 403) {
        onOpen();
      } else {
        toast.error("Somthing went wrong");
      }
    } finally {
      router.refresh();
    }
  };

  const isLoading = formState.isSubmitting;

  return (
    <div>
      <Heading
        title="Image Generation"
        description="Turn your prompt into images."
        icon={ImageIcon}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
      />
      <div className="px-4 lg:px-8">
        <FormProvider {...formMethods}>
          <form
            onSubmit={handleSubmit(handleGenerateImage)}
            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
          >
            <FormField
              control={control}
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      disabled={isLoading}
                      placeholder="A cute dog playing in beach"
                      {...field}
                      autoFocus
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              className="col-span-12 lg:col-span-2 w-full"
              disabled={isLoading}
            >
              Generate
            </Button>
          </form>
        </FormProvider>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {!imageUrl && !isLoading && (
            <Empty label="No Image generation started." />
          )}
          {imageUrl && (
            // <div className="flex flex-col-reverse gap-y-4">
            <Card
              key={imageUrl}
              className="rounded-lg overflow-hidden w-[250px] p-2"
            >
              {/* <div className="relative"> */}
              <Image
                alt="image"
                // fill
                src={imageUrl || ""}
                width={250}
                height={250}
                className="rounded-t-lg"
              />
              {/* </div> */}
              <CardFooter className="p-2">
                <Button
                  onClick={() => window.open(imageUrl || "")}
                  variant="secondary"
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardFooter>
            </Card>
            // </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextToImageComponent;
