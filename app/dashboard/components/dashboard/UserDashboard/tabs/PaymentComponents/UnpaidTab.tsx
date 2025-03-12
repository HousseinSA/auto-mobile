import { ServicePaymentCard } from "./ServicePaymentCard";
import { PaymentMethodsSection } from "./PaymentMethodsSection";
import NoPaymentResults from "@/shared/NoPaymentResults";
import { PaymentMethod } from "@/lib/types/PaymentTypes";
import { Service } from "@/lib/types/ServiceTypes";

interface UnpaidTabProps {
  unpaidServices: Service[];
  selectedMethod: PaymentMethod;
  setSelectedMethod: (method: PaymentMethod) => void;
  copiedField: string | null;
  onCopy: (text: string) => void;
  paymentProofs: { [key: string]: File };
  onProofSelect: (serviceId: string, file: File | null) => void;
  onSubmitPayment: (serviceId: string) => void;
  serviceLoading: { [key: string]: boolean };
}

export function UnpaidTab({
  unpaidServices,
  selectedMethod,
  setSelectedMethod,
  copiedField,
  onCopy,
  paymentProofs,
  onProofSelect,
  onSubmitPayment,
  serviceLoading,
}: UnpaidTabProps) {
  if (unpaidServices.length === 0) {
    return <NoPaymentResults type="no-unpaid" isAdmin={false} />;
  }

  console.log("unpaidServices", unpaidServices);
  return (
    <div className="space-y-4">
      <PaymentMethodsSection
        selectedMethod={selectedMethod}
        onMethodSelect={setSelectedMethod}
        copiedField={copiedField}
        onCopy={onCopy}
      />
      <h3 className="text-primary font-medium text-lg">Services A payer</h3>
      <div className="space-y-4">
        {unpaidServices.map((service) => (
          <ServicePaymentCard
            key={service._id}
            service={service}
            paymentProof={paymentProofs[service._id]}
            onProofSelect={(file) => onProofSelect(service._id, file)}
            onSubmitPayment={() => onSubmitPayment(service._id)}
            isLoading={serviceLoading[service._id]}
          />
        ))}
      </div>
    </div>
  );
}

// user

// username
// "aly"
// password
// "alina306"
// fullName
// "Aly"
// phoneNumber
// "30607010"
// email
// "seyidnaali0@gmail.com"

// admin

// username
// "admin"
// password
// "alina306"
// fullName
// "Admin "
// phoneNumber
// "30607010"
// email
// "seyidnaali0@gmail.com"

// services

// fuelType
// "Diesel"
// ecuType
// "Denso"
// generation
// "GEN1_GEN2"
// ecuNumber
// "89663-60z64"

// serviceOptions
// Object

// DPF_OFF
// Object

// EGR_OFF
// Object

// SCR_ADBLUE_OFF
// Object
// userName
// "aly"
// status
// "ANNULÉ"
// totalPrice
// 75  Montant: 75 € has prop
// clientName
// "Aly"
// phoneNumber
// "30607010"

// service 2

// fuelType;
// ("Diesel");
// ecuType;
// ("Denso");
// generation;
// ("GEN1_GEN2");
// ecuNumber;
// ("89663-0kr72");

// serviceOptions;
// Object;
// userName;
// ("aly");
// status;
// ("EN ATTENTE");
// totalPrice;
// 45;
// clientName;
// ("Aly");
// phoneNumber;
// ("30607010");
