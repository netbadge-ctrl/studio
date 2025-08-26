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
        sop: [
          { step: 1, action: "验证服务器序列号", completed: false },
          { step: 2, action: "安全停机并断开电源", completed: false },
          { step: 3, action: "移除所有旧的 16GB 内存条", completed: false },
          { step: 4, action: "安装新的 32GB 内存条", completed: false },
          { step: 5, action: "重新连接电源并启动服务器", completed: false },
          { step: 6, action: "进入 BIOS/UEFI 确认内存识别正确", completed: false },
          { step: 7, action: "将工单状态标记为“已完成”", completed: false },
        ]
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
        sop: [
          { step: 1, action: "将服务器安装到指定机架位置", completed: true },
          { step: 2, action: "安装 2 个 CPU", completed: true },
          { step: 3, action: "安装 8 条内存", completed: false },
          { step: 4, action: "安装 4 个 NVMe SSD", completed: false },
          { step: 5, action: "安装 2 个网卡", completed: false },
          { step: 6, action: "连接电源线和网络线", completed: false },
        ]
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
        sop: [
           { step: 1, action: "将交换机安装到指定机架位置", completed: true },
           { step: 2, action: "连接上行链路", completed: false },
           { step: 3, action: "连接服务器 SN-F2G8H4I6J1", completed: false },
           { step: 4, action: "配置 VLAN", completed: false },
        ]
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
            sop: []
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
        sop: []
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
        serialNumber: "SN-V6W2X8Y4Z1",
        location: {
          module: "A1",
          rack: "R18",
          uPosition: 30,
        },
        currentConfig: [
            { type: "CPU", model: "Intel Xeon E5-2620 v3", quantity: 2, partNumber: "CPU-INT-2620V3"},
            { type: "内存", model: "DDR4 16GB 2133MHz", quantity: 4, partNumber: "MEM-16G-2133-C" },
        ],
        targetConfig: [],
        sop: [
          { step: 1, action: "下架服务器", completed: false },
          { step: 2, action: "擦除数据", completed: false },
        ]
      },
      {
        id: "dev-007",
        type: "服务器",
        serialNumber: "SN-V6W2X8Y4Z2",
        location: {
          module: "A1",
          rack: "R18",
          uPosition: 31,
        },
        currentConfig: [
            { type: "CPU", model: "Intel Xeon E5-2620 v3", quantity: 2, partNumber: "CPU-INT-2620V3"},
            { type: "内存", model: "DDR4 16GB 2133MHz", quantity: 4, partNumber: "MEM-16G-2133-C" },
        ],
        targetConfig: [],
        sop: [
          { step: 1, action: "下架服务器", completed: false },
          { step: 2, action: "擦除数据", completed: false },
        ]
      },
    ],
  },
];
