"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import { useServiceStore } from "@/store/ServiceStore";
import { useFormStore } from "@/store/FormStore";
import {
  ECUType,
  FuelType,
  Generation,
  Service,
  ServiceRequest,
} from "@/lib/types/ServiceTypes";
import { DashboardHeader } from "./DashboardHeader/DashboardHeader";
import { ToyotaLogo } from "./DashboardHeader/ToyotaLogo";
import { CreditCard, FileText, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServicesTab } from "./UserDashboard/tabs/ServicesTab";
import { FilesTab } from "./UserDashboard/tabs/FilesTab";
import { PaymentsTab } from "./UserDashboard/tabs/PaymentsTab";
import { NotificationBadge } from "@/lib/utils/notification-badge";
import { usePaymentStore } from "@/store/PaymentStore";

interface UserDashboardProps {
  username: string;
}

export default function UserDashboard({ username }: UserDashboardProps) {
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    services,
    showForm,
    editingService,
    setShowForm,
    setEditingService,
    fetchUserServices,
    deleteService,
    updateService,
    addService,
    loading,
  } = useServiceStore();

  const form = useFormStore();
  const { payments, loading: paymentsLoading } = usePaymentStore();

  // Add loading state for payments initialization
  const [isPaymentsInitialized, setIsPaymentsInitialized] = useState(false);

  // Fetch payments when component mounts
  useEffect(() => {
    const initializePayments = async () => {
      if (session?.user?.name) {
        await usePaymentStore.getState().fetchPayments(session.user.name);
        setIsPaymentsInitialized(true);
      }
    };

    if (status === "authenticated" && session?.user?.name) {
      initializePayments();
    }
  }, [status, session?.user?.name]);

  // Update the unpaid services count calculation to consider loading state
  const unpaidServicesCount = useMemo(() => {
    // Don't calculate until both services and payments are loaded
    if (!isPaymentsInitialized || paymentsLoading) return 0;

    return services.filter((service) => {
      const hasPayment = payments.some(
        (payment) => payment.service && payment.service._id === service._id
      );
      return !hasPayment;
    }).length;
  }, [services, payments, isPaymentsInitialized, paymentsLoading]);

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.name?.toLowerCase() === username.toLowerCase()
    ) {
      fetchUserServices(username);
    }
  }, [status, session?.user?.name, username, fetchUserServices]);

  // Handle form population
  const { populateForm } = form;
  useEffect(() => {
    if (editingService && showForm) {
      populateForm(editingService);
    }
  }, [editingService, showForm, populateForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const serviceData: ServiceRequest = {
        fuelType: form.fuelType as FuelType,
        ecuType: form.ecuType as ECUType,
        generation: form.generation as Generation,
        ecuNumber: form.getFullEcuNumber(),
        serviceOptions: form.serviceOptions,
        userName: username,
        status: editingService?.status || "EN ATTENTE",
        stockFile: form.stockFile ? { name: form.stockFile.name } : undefined,
        totalPrice: form.calculateTotal(),
        ...(editingService && { status: editingService.status }),
      };

      const formData = new FormData();
      formData.append("serviceData", JSON.stringify(serviceData));

      if (form.stockFile) {
        formData.append("stockFile", form.stockFile);
      }

      if (editingService) {
        const success = await updateService(editingService._id, serviceData);
        if (success) {
          await fetchUserServices(username);
          handleCancel();
        }
      } else {
        const success = await addService(username);
        if (success) {
          await fetchUserServices(username);
          handleCancel();
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    const success = await deleteService(serviceId);
    if (success) {
      await fetchUserServices(username);
    }
  };

  const handleEditService = (service: Service) => {
    form.resetForm();
    setEditingService(service);
    form.populateForm(service);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingService(null);
    setShowForm(false);
    form.resetForm();
  };

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader username={username} displayName={session?.user?.name} />
      <div className="flex flex-col sm:flex-row items-start flex-1">
        <ToyotaLogo />
        <div className="w-full mt-4 sm:mt-0 sm:ml-4 flex-1">
          <div className="relative flex flex-col flex-1">
            <div
              className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/90 to-white/70"
              style={{
                backgroundImage: "url('/images/tunning.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                opacity: "0.15",
                zIndex: 0,
                mixBlendMode: "overlay",
              }}
            />
            <div className="relative z-10 flex-1">
              <Tabs
                defaultValue="services"
                className="w-full h-full flex flex-col"
              >
                <TabsList className="w-full flex flex-col sm:flex-row justify-start sm:justify-end gap-2 sm:gap-4 sm:pt-4 px-4 bg-white/80 backdrop-blur-sm">
                  <TabsTrigger
                    value="services"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="whitespace-nowrap">Services</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="payments"
                    className="relative w-full sm:w-auto flex items-center justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    <div className="relative">
                      <CreditCard className="h-4 w-4" />
                      <NotificationBadge
                        count={unpaidServicesCount}
                        className="absolute -top-4 -right-1"
                      />
                    </div>
                    <span className="whitespace-nowrap">Paiements</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="files"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="whitespace-nowrap">Mes fichiers</span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent className="flex-1" value="services">
                  <ServicesTab
                    username={username}
                    showForm={showForm}
                    editingService={editingService}
                    isSubmitting={isSubmitting}
                    services={services}
                    loading={loading}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    onEdit={handleEditService}
                    onDelete={handleDeleteService}
                  />
                </TabsContent>
                <TabsContent value="files">
                  <FilesTab />
                </TabsContent>
                <TabsContent value="payments">
                  <PaymentsTab />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
