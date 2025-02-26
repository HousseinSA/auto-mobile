export const SERVICE_OPTIONS = {
  DENSO_DIESEL_GEN1_GEN2: {
    title: "DENSO DIESEL (GEN 1 & GEN 2)",
    options: {
      DTC_OFF: { label: "DTC OFF", price: 10 },
      IMMO_OFF: { label: "IMMO OFF (KD, GD, DIESEL ENGINES)", price: 20 },
      VMAX_OFF: { label: "VMAX OFF", price: 20 },
      DPF_OFF: { label: "DPF OFF", price: 25 },
      EGR_OFF: { label: "EGR OFF", price: 20 },
      SCR_ADBLUE_OFF: { label: "SCR ADBLUE OFF", price: 30 },
      SCV_OFF: { label: "SCV OFF", price: 20 },
      STAGE_1: { label: "STAGE 1", price: 150 },
      STAGE_2: { label: "STAGE 2", price: 150 },
      STOCK: { label: "STOCK", price: 10 },
      DPF_EGR_SCR_STAGE1: { label: "DPF EGR SCR OFF + STAGE 1", price: 200 },
    },
  },
  BOSCH_DIESEL_GEN1_GEN2: {
    title: "BOSCH DIESEL (GEN 1 & GEN 2)",
    options: {
      DTC_OFF: { label: "DTC OFF", price: 15 },
      DPF_OFF: { label: "DPF OFF", price: 35 },
      EGR_OFF: { label: "EGR OFF", price: 25 },
    },
  },
  DENSO_DELPHI_ESSENCE_GEN1_GEN2: {
    title: "DENSO DELPHI ESSENCE (GEN 1 & GEN 2)",
    options: {
      CAT_OFF: { label: "CAT OFF", price: 25 },
      EVAP_OFF: { label: "EVAP OFF", price: 20 },
      DTC_OFF: { label: "DTC OFF", price: 10 },
      EGR_OFF: { label: "EGR OFF", price: 15 },
      STAGE_1: { label: "STAGE 1", price: 50 },
      STOCK: { label: "STOCK", price: 10 },
    },
  },
  DIESEL_GEN3_GEN4: {
    title: "DENSO DIESEL (GEN 3 & GEN 4)",
    options: {
      DPF_EGR_SCR_OFF: { label: "DPF EGR SCR OFF", price: 180 },
      DPF_EGR_SCR_OFF_STAGE1: { label: "DPF EGR SCR OFF + STAGE 1", price: 200 },
    },
  },
  ESSENCE_GEN3_GEN4: {
    title: "ESSENCE (GEN 3 & GEN 4)",
    options: {
      E2_EVAP_OFF: { label: "E2 EVAP OFF", price: 80 },
      E2_EVAP_OFF_STAGE1: { label: "E2 EVAP OFF + STAGE 1", price: 150 },
    },
  },
}
