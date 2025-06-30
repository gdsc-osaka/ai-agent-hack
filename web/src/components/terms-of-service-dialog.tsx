"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TermsOfServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
}

export function TermsOfServiceDialog({
  isOpen,
  onClose,
  onAccept,
  onDecline,
}: TermsOfServiceDialogProps) {
  const [termsContent, setTermsContent] = useState("");
  const [privacyContent, setPrivacyContent] = useState("");

  useEffect(() => {
    if (isOpen) {
      Promise.all([
        fetch("/terms-of-service.md").then((res) => res.text()),
        fetch("/privacy-policy.md").then((res) => res.text()),
      ])
        .then(([terms, privacy]) => {
          setTermsContent(terms);
          setPrivacyContent(privacy);
        })
        .catch((error) => {
          console.error("ドキュメントの読み込みに失敗しました:", error);
          setTermsContent("利用規約の読み込みに失敗しました。");
          setPrivacyContent("プライバシーポリシーの読み込みに失敗しました。");
        });
    }
  }, [isOpen]);

  const renderContent = (content: string) => (
    <ScrollArea className="h-full w-full markdown-content">
      <div className="p-4 text-sm">
        {content ? (
          <ReactMarkdown>{content}</ReactMarkdown>
        ) : (
          <div className="flex items-center justify-center h-32">
            読み込み中...
          </div>
        )}
      </div>
    </ScrollArea>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] grid grid-rows-[auto_1fr_auto] gap-4 p-6">
        <DialogHeader className="p-0">
          <DialogTitle className="text-xl font-bold">
            ご利用にあたって
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="terms" className="flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="terms">利用規約</TabsTrigger>
            <TabsTrigger value="privacy">プライバシーポリシー</TabsTrigger>
          </TabsList>

          <div className="flex-1 mt-4 border rounded overflow-hidden">
            <TabsContent value="terms" className="h-full m-0">
              {renderContent(termsContent)}
            </TabsContent>
            <TabsContent value="privacy" className="h-full m-0">
              {renderContent(privacyContent)}
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex gap-4 justify-end">
          <Button
            variant="outline"
            onClick={onDecline}
            className="min-w-[100px]"
          >
            同意しない
          </Button>
          <Button onClick={onAccept} className="min-w-[100px]">
            同意する
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
