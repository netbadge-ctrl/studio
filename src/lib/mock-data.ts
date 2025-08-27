import type { Employee, WorkOrder, Component } from "./types";

const generatedModels = new Set<string>();

function generateUniqueModel(): string {
  let modelId;
  do {
    modelId = `model-${Math.random().toString().substring(2, 8)}`;
  } while (generatedModels.has(modelId));
  generatedModels.add(modelId);
  return modelId;
}

function processComponents(components: Component[]): Component[] {
  return components.map(c => ({
    ...c,
    model: generateUniqueModel(),
  }));
}

export const employees: Employee[] = [
  { id: "emp-001", name: "爱丽丝" },
  { id: "emp-002", name: "鲍勃" },
  { id: "emp-003", name: "查理" },
  { id: "emp-004", name: "戴安娜" },
];

const rawWorkOrders: Omit<WorkOrder, 'devices'> & { devices: Omit<WorkOrder['devices'][0], 'currentConfig' | 'targetConfig'> & { currentConfig: Omit<Component, 'model'>[], targetConfig: Omit<Component, 'model'>[] }[] }[] = [
  {
    id: "wo-001",
    title: "升级 Hyperion-01 的内存",
    type: "服务器改造",
    status: "已分配",
    assignedTo: [employees[0]],
    devices: [
      {
        id: "dev-001",
        type: "服务器",
        model: "Dell PowerEdge R740",
        serialNumber: "SN-A7B3C9D1E5",
        location: {
          module: "A1",
          rack: "R12",
          uPosition: 24,
        },
        currentConfig: [
          { type: "内存", manufacturer: "Hynix", quantity: 1, partNumber: "MEM-16G-2400-A", slot: "A1" },
          { type: "内存", manufacturer: "Hynix", quantity: 1, partNumber: "MEM-16G-2400-A", slot: "A2" },
          { type: "内存", manufacturer: "Hynix", quantity: 1, partNumber: "MEM-16G-2400-A", slot: "A3" },
          { type: "内存", manufacturer: "Hynix", quantity: 1, partNumber: "MEM-16G-2400-A", slot: "A4" },
          { type: "SSD", manufacturer: "Samsung", quantity: 1, partNumber: "SSD-480G-S-PM883", slot: "Disk 0" },
          { type: "SSD", manufacturer: "Samsung", quantity: 1, partNumber: "SSD-480G-S-PM883", slot: "Disk 1" },
        ],
        targetConfig: [
          { type: "内存", manufacturer: "Samsung", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A1" },
          { type: "内存", manufacturer: "Samsung", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A2" },
          { type: "内存", manufacturer: "Samsung", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A3" },
          { type: "内存", manufacturer: "Samsung", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A4" },
          { type: "SSD", manufacturer: "Samsung", quantity: 1, partNumber: "SSD-480G-S-PM883", slot: "Disk 0" },
          { type: "SSD", manufacturer: "Samsung", quantity: 1, partNumber: "SSD-480G-S-PM883", slot: "Disk 1" },
        ],
      },
    ],
  },
  {
    id: "wo-002",
    title: "安装新 Web 服务器和交换机",
    type: "新服务器部署",
    status: "进行中",
    assignedTo: [employees[0], employees[2]],
    devices: [
      {
        id: "dev-002",
        type: "服务器",
        model: "HPE ProLiant DL380 Gen10",
        serialNumber: "SN-F2G8H4I6J1",
        location: {
          module: "B2",
          rack: "R05",
          uPosition: 12,
        },
        currentConfig: [],
        targetConfig: [
            { type: "CPU", manufacturer: "Intel", quantity: 1, partNumber: "CPU-INT-4210", slot: "CPU 1"},
            { type: "CPU", manufacturer: "Intel", quantity: 1, partNumber: "CPU-INT-4210", slot: "CPU 2"},
            { type: "内存", manufacturer: "Samsung", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A1" },
            { type: "内存", manufacturer: "Samsung", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A2" },
            { type: "内存", manufacturer: "Samsung", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A3" },
            { type: "内存", manufacturer: "Samsung", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A4" },
            { type: "内存", manufacturer: "Samsung", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "B1" },
            { type: "内存", manufacturer: "Samsung", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "B2" },
            { type: "内存", manufacturer: "Samsung", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "B3" },
            { type: "内存", manufacturer: "Samsung", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "B4" },
            { type: "SSD", manufacturer: "Intel", quantity: 1, partNumber: "SSD-1T-I-P4510", slot: "NVMe 0" },
            { type: "SSD", manufacturer: "Intel", quantity: 1, partNumber: "SSD-1T-I-P4510", slot: "NVMe 1" },
            { type: "SSD", manufacturer: "Intel", quantity: 1, partNumber: "SSD-1T-I-P4510", slot: "NVMe 2" },
            { type: "SSD", manufacturer: "Intel", quantity: 1, partNumber: "SSD-1T-I-P4510", slot: "NVMe 3" },
            { type: "网卡", manufacturer: "Mellanox", quantity: 1, partNumber: "NIC-MEL-CX5", slot: "PCIe 1" },
            { type: "网卡", manufacturer: "Mellanox", quantity: 1, partNumber: "NIC-MEL-CX5", slot: "PCIe 2" },
        ],
      },
      {
        id: "dev-006",
        type: "交换机",
        model: "Cisco Nexus 93180YC-EX",
        serialNumber: "SN-SW-A9B8C7D6E5",
        location: {
          module: "B2",
          rack: "R05",
          uPosition: 24,
        },
        currentConfig: [],
        targetConfig: [],
      }
    ],
  },
  {
    id: "wo-003",
    title: "更换核心网络中的故障交换机",
    type: "交换机维护",
    status: "已阻塞",
    assignedTo: [employees[1]],
    devices: [
        {
            id: "dev-003",
            type: "交换机",
            model: "Arista 7050SX-64",
            serialNumber: "SN-K3L9M5N1P7",
            location: {
                module: "Core",
                rack: "N01",
                uPosition: 48,
            },
            currentConfig: [],
            targetConfig: [],
        }
    ],
  },
  {
    id: "wo-004",
    title: "为 Prometheus-03 添加 SSD 存储",
    type: "服务器改造",
    status: "已完成",
    assignedTo: [employees[3]],
    devices: [
      {
        id: "dev-004",
        type: "服务器",
        model: "Supermicro 2029U-TR4",
        serialNumber: "SN-Q8R4S2T7U3",
        location: {
          module: "C3",
          rack: "R21",
          uPosition: 3,
        },
        currentConfig: [
          { type: "SATA", manufacturer: "Seagate", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 1" },
          { type: "SATA", manufacturer: "Seagate", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 2" },
          { type: "SATA", manufacturer: "Seagate", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 3" },
          { type: "SATA", manufacturer: "Seagate", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 4" },
          { type: "SATA", manufacturer: "Seagate", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 5" },
          { type: "SATA", manufacturer: "Seagate", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 6" },
          { type: "SATA", manufacturer: "Seagate", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 7" },
          { type: "SATA", manufacturer: "Seagate", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 8" },
        ],
        targetConfig: [
          { type: "SATA", manufacturer: "Seagate", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 1" },
          { type: "SATA", manufacturer: "Seagate", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 2" },
          { type: "SATA", manufacturer: "Seagate", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 3" },
          { type: "SATA", manufacturer: "Seagate", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 4" },
          { type: "SATA", manufacturer: "Seagate", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 5" },
          { type: "SATA", manufacturer: "Seagate", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 6" },
          { type: "SATA", manufacturer: "Seagate", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 7" },
          { type: "SATA", manufacturer: "Seagate", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 8" },
          { type: "SSD", manufacturer: "Samsung", quantity: 1, partNumber: "SSD-960G-S-PM883", slot: "Bay 9" },
          { type: "SSD", manufacturer: "Samsung", quantity: 1, partNumber: "SSD-960G-S-PM883", slot: "Bay 10" },
          { type: "SSD", manufacturer: "Samsung", quantity: 1, partNumber: "SSD-960G-S-PM883", slot: "Bay 11" },
          { type: "SSD", manufacturer: "Samsung", quantity: 1, partNumber: "SSD-960G-S-PM883", slot: "Bay 12" },
        ],
      },
    ],
  },
  {
    id: "wo-005",
    title: "淘汰服务器 Rhea-15, Rhea-16",
    type: "服务器改造",
    status: "待处理",
    assignedTo: [],
    devices: [
      {
        id: "dev-005",
        type: "服务器",
        model: "Dell PowerEdge R630",
        serialNumber: "SN-V6W2X8Y4Z1",
        location: {
          module: "A1",
          rack: "R18",
          uPosition: 30,
        },
        currentConfig: [
            { type: "CPU", manufacturer: "Intel", quantity: 1, partNumber: "CPU-INT-2620V3", slot: "CPU 1"},
            { type: "CPU", manufacturer: "Intel", quantity: 1, partNumber: "CPU-INT-2620V3", slot: "CPU 2"},
            { type: "内存", manufacturer: "Crucial", quantity: 1, partNumber: "MEM-16G-2133-C", slot: "A1" },
            { type: "内存", manufacturer: "Crucial", quantity: 1, partNumber: "MEM-16G-2133-C", slot: "A2" },
            { type: "内存", manufacturer: "Crucial", quantity: 1, partNumber: "MEM-16G-2133-C", slot: "B1" },
            { type: "内存", manufacturer: "Crucial", quantity: 1, partNumber: "MEM-16G-2133-C", slot: "B2" },
        ],
        targetConfig: [],
      },
      {
        id: "dev-007",
        type: "服务器",
        model: "Dell PowerEdge R630",
        serialNumber: "SN-V6W2X8Y4Z2",
        location: {
          module: "A1",
          rack: "R18",
          uPosition: 31,
        },
        currentConfig: [
            { type: "CPU", manufacturer: "Intel", quantity: 1, partNumber: "CPU-INT-2620V3", slot: "CPU 1"},
            { type: "CPU", manufacturer: "Intel", quantity: 1, partNumber: "CPU-INT-2620V3", slot: "CPU 2"},
            { type: "内存", manufacturer: "Crucial", quantity: 1, partNumber: "MEM-16G-2133-C", slot: "A1" },
            { type: "内存", manufacturer: "Crucial", quantity: 1, partNumber: "MEM-16G-2133-C", slot: "A2" },
            { type: "内存", manufacturer: "Crucial", quantity: 1, partNumber: "MEM-16G-2133-C", slot: "B1" },
            { type: "内存", manufacturer: "Crucial", quantity: 1, partNumber: "MEM-16G-2133-C", slot: "B2" },
        ],
        targetConfig: [],
      },
    ],
  },
  {
    id: "wo-006",
    title: "C1 区机架容量扩展",
    type: "新服务器部署",
    status: "已分配",
    assignedTo: [employees[0], employees[1], employees[2]],
    devices: [
      {
        id: "dev-008",
        type: "服务器",
        model: "Dell PowerEdge R650",
        serialNumber: "SN-DELL-R650-01",
        location: { module: "C1", rack: "R01", uPosition: 10 },
        currentConfig: [
          { type: "CPU", manufacturer: "Intel", quantity: 1, partNumber: "CPU-INT-6330", slot: "CPU 1" },
          { type: "CPU", manufacturer: "Intel", quantity: 1, partNumber: "CPU-INT-6330", slot: "CPU 2" },
          { type: "内存", manufacturer: "Hynix", quantity: 1, partNumber: "MEM-16G-2400-A", slot: "A1" },
          { type: "SSD", manufacturer: "Intel", quantity: 1, partNumber: "SSD-3.84T-I-P5510", slot: "NVMe 0" },
        ],
        targetConfig: [
          { type: "CPU", manufacturer: "Intel", quantity: 1, partNumber: "CPU-INT-6330", slot: "CPU 1" },
          { type: "CPU", manufacturer: "Intel", quantity: 1, partNumber: "CPU-INT-6330", slot: "CPU 2" },
          { type: "内存", manufacturer: "Samsung", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A1" },
          { type: "SSD", manufacturer: "Intel", quantity: 1, partNumber: "SSD-3.84T-I-P5510", slot: "NVMe 0" },
        ],
      },
      {
        id: "dev-009",
        type: "服务器",
        model: "Dell PowerEdge R650",
        serialNumber: "SN-DELL-R650-02",
        location: { module: "C1", rack: "R01", uPosition: 11 },
        currentConfig: [],
        targetConfig: [
          { type: "CPU", manufacturer: "Intel", quantity: 1, partNumber: "CPU-INT-6330", slot: "CPU 1" },
          { type: "CPU", manufacturer: "Intel", quantity: 1, partNumber: "CPU-INT-6330", slot: "CPU 2" },
          { type: "内存", manufacturer: "Samsung", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A1" },
          { type: "SSD", manufacturer: "Intel", quantity: 1, partNumber: "SSD-3.84T-I-P5510", slot: "NVMe 0" },
        ],
      },
      {
        id: "dev-010",
        type: "服务器",
        model: "HPE ProLiant DL360 Gen10",
        serialNumber: "SN-HPE-DL360-01",
        location: { module: "C1", rack: "R02", uPosition: 15 },
        currentConfig: [],
        targetConfig: [
          { type: "CPU", manufacturer: "Intel", quantity: 1, partNumber: "CPU-INT-4214", slot: "CPU 1" },
          { type: "CPU", manufacturer: "Intel", quantity: 1, partNumber: "CPU-INT-4214", slot: "CPU 2" },
          { type: "内存", manufacturer: "HPE", quantity: 1, partNumber: "MEM-32G-2933-H", slot: "A1" },
          { type: "SATA", manufacturer: "HPE", quantity: 1, partNumber: "HDD-1.2T-H-10K", slot: "Bay 1" },
        ],
      },
      {
        id: "dev-011",
        type: "交换机",
        model: "Cisco Nexus 93108TC-EX",
        serialNumber: "SN-CIS-93108-01",
        location: { module: "C1", rack: "R01", uPosition: 22 },
        currentConfig: [],
        targetConfig: [],
      },
      {
        id: "dev-012",
        type: "交换机",
        model: "Cisco Nexus 93108TC-EX",
        serialNumber: "SN-CIS-93108-02",
        location: { module: "C1", rack: "R02", uPosition: 22 },
        currentConfig: [],
        targetConfig: [],
      },
      {
        id: "dev-013",
        type: "存储设备",
        model: "NetApp FAS2750",
        serialNumber: "SN-NTAP-2750-01",
        location: { module: "C1", rack: "R03", uPosition: 5 },
        currentConfig: [],
        targetConfig: [
          { type: "SSD", manufacturer: "NetApp", quantity: 1, partNumber: "SSD-960G-N", slot: "Disk 1" },
          { type: "SSD", manufacturer: "NetApp", quantity: 1, partNumber: "SSD-960G-N", slot: "Disk 2" },
          { type: "SSD", manufacturer: "NetApp", quantity: 1, partNumber: "SSD-960G-N", slot: "Disk 3" },
          { type: "SSD", manufacturer: "NetApp", quantity: 1, partNumber: "SSD-960G-N", slot: "Disk 4" },
        ],
      }
    ]
  }
];


export const workOrders: WorkOrder[] = rawWorkOrders.map(wo => ({
  ...wo,
  devices: wo.devices.map(d => ({
    ...d,
    currentConfig: processComponents(d.currentConfig as Component[]),
    targetConfig: processComponents(d.targetConfig as Component[]),
  })),
}));
