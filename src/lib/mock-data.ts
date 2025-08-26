import type { Employee, WorkOrder } from "./types";

export const employees: Employee[] = [
  { id: "emp-001", name: "爱丽丝" },
  { id: "emp-002", name: "鲍勃" },
  { id: "emp-003", name: "查理" },
  { id: "emp-004", name: "戴安娜" },
];

export const workOrders: WorkOrder[] = [
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
        serialNumber: "SN-A7B3C9D1E5",
        location: {
          module: "A1",
          rack: "R12",
          uPosition: 24,
        },
        currentConfig: [
          { type: "内存", model: "DDR4 16GB 2400MHz", quantity: 4, partNumber: "MEM-16G-2400-A" },
          { type: "SSD", model: "Samsung PM883 480GB", quantity: 2, partNumber: "SSD-480G-S-PM883" },
        ],
        targetConfig: [
          { type: "内存", model: "DDR4 32GB 3200MHz", quantity: 4, partNumber: "MEM-32G-3200-B" },
          { type: "SSD", model: "Samsung PM883 480GB", quantity: 2, partNumber: "SSD-480G-S-PM883" },
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
        serialNumber: "SN-F2G8H4I6J1",
        location: {
          module: "B2",
          rack: "R05",
          uPosition: 12,
        },
        currentConfig: [],
        targetConfig: [
            { type: "CPU", model: "Intel Xeon Silver 4210", quantity: 2, partNumber: "CPU-INT-4210"},
            { type: "内存", model: "DDR4 32GB 3200MHz", quantity: 8, partNumber: "MEM-32G-3200-B" },
            { type: "SSD", model: "Intel P4510 1TB NVMe", quantity: 4, partNumber: "SSD-1T-I-P4510" },
            { type: "网卡", model: "Mellanox CX-5 25GbE", quantity: 2, partNumber: "NIC-MEL-CX5" },
        ],
      },
      {
        id: "dev-006",
        type: "交换机",
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
        serialNumber: "SN-Q8R4S2T7U3",
        location: {
          module: "C3",
          rack: "R21",
          uPosition: 3,
        },
        currentConfig: [
          { type: "SATA", model: "Seagate Exos 4TB", quantity: 8, partNumber: "HDD-4T-S-EXOS" },
        ],
        targetConfig: [
          { type: "SATA", model: "Seagate Exos 4TB", quantity: 8, partNumber: "HDD-4T-S-EXOS" },
          { type: "SSD", model: "Samsung PM883 960GB", quantity: 4, partNumber: "SSD-960G-S-PM883" },
        ],
      },
    ],
  },
  {
    id: "wo-005",
    title: "淘汰服务器 Rhea-15",
    type: "服务器改造",
    status: "待处理",
    assignedTo: [],
    devices: [
      {
        id: "dev-005",
        type: "服务器",
        serialNumber: "SN-V6W2X8Y4Z1",
        location: {
          module: "A1",
          rack: "R18",
          uPosition: 30,
        },
        currentConfig: [],
        targetConfig: [],
      },
    ],
  },
];
