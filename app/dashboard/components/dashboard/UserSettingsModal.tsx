"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings } from "lucide-react"
import { useUserSettingsStore } from "@/store/userSettingsStore"
import { ProfileForm } from "./userSettingsModal/ProfileForm"
import { PasswordForm } from "./userSettingsModal/PasswordForm"
import { DangerZone } from "./userSettingsModal/DangerZone"

export function UserSettingsModal({ username }: { username: string }) {
  const [open, setOpen] = useState(false)
  const { resetForm, fetchUserData } = useUserSettingsStore()

  useEffect(() => {
    if (open) {
      fetchUserData(username)
    }
  }, [open, username, fetchUserData])

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          resetForm()
        }
        setOpen(isOpen)
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-[95%] p-4 sm:p-6 rounded-lg">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl">Paramètres du compte</DialogTitle>
          <DialogDescription className="text-sm">
            Gérez vos informations personnelles et la sécurité de votre compte
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="profile" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="profile" className="text-sm">
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="text-sm">
              Sécurité
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="mt-0 space-y-4">
            <ProfileForm username={username} />
          </TabsContent>
          <TabsContent value="security" className="mt-0 space-y-4">
            <PasswordForm username={username} />
            <DangerZone username={username} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
