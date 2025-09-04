
import type { Employee, WorkOrder, Component } from "./types";

export const employees: Employee[] = [
  { id: "emp-001", name: "爱丽丝" },
  { id: "emp-002", name: "鲍勃" },
  { id: "emp-003", name: "查理" },
  { id: "emp-004", name: "戴安娜" },
];

const rawWorkOrders: WorkOrder[] = [
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
        serialNumber: "SN-001",
        status: "待处理",
        location: {
          module: "A1",
          rack: "R12",
          uPosition: 24,
        },
        currentConfig: [
          { type: "内存", manufacturer: "Hynix", model: "16GB DDR4 2400MHz", quantity: 1, partNumber: "MEM-16G-2400-A", slot: "A1" },
          { type: "内存", manufacturer: "Hynix", model: "16GB DDR4 2400MHz", quantity: 1, partNumber: "MEM-16G-2400-A", slot: "A2" },
          { type: "内存", manufacturer: "Hynix", model: "16GB DDR4 2400MHz", quantity: 1, partNumber: "MEM-16G-2400-A", slot: "A3" },
          { type: "内存", manufacturer: "Hynix", model: "16GB DDR4 2400MHz", quantity: 1, partNumber: "MEM-16G-2400-A", slot: "A4" },
          { type: "SSD", manufacturer: "Samsung", model: "PM883 480GB SSD", quantity: 1, partNumber: "SSD-480G-S-PM883", slot: "Disk 0" },
          { type: "SSD", manufacturer: "Samsung", model: "PM883 480GB SSD", quantity: 1, partNumber: "SSD-480G-S-PM883", slot: "Disk 1" },
        ],
        targetConfig: [
          { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A1" },
          { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A2" },
          { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A3" },
          { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A4" },
          { type: "SSD", manufacturer: "Samsung", model: "PM883 480GB SSD", quantity: 1, partNumber: "SSD-480G-S-PM883", slot: "Disk 0" },
          { type: "SSD", manufacturer: "Samsung", model: "PM883 480GB SSD", quantity: 1, partNumber: "SSD-480G-S-PM883", slot: "Disk 1" },
        ],
      },
    ],
  },
  {
    id: "wo-002",
    title: "安装新 Web 服务器",
    type: "新服务器部署",
    status: "进行中",
    assignedTo: [employees[0], employees[2]],
    devices: [
      {
        id: "dev-002",
        type: "服务器",
        model: "HPE ProLiant DL380 Gen10",
        serialNumber: "SN-002",
        status: "待处理",
        location: {
          module: "B2",
          rack: "R05",
          uPosition: 12,
        },
        currentConfig: [],
        targetConfig: [
            { type: "CPU", manufacturer: "Intel", model: "Xeon Silver 4210", quantity: 1, partNumber: "CPU-INT-4210", slot: "CPU 1"},
            { type: "CPU", manufacturer: "Intel", model: "Xeon Silver 4210", quantity: 1, partNumber: "CPU-INT-4210", slot: "CPU 2"},
            { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A1" },
            { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A2" },
            { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A3" },
            { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A4" },
            { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "B1" },
            { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "B2" },
            { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "B3" },
            { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "B4" },
            { type: "SSD", manufacturer: "Intel", model: "P4510 1TB NVMe SSD", quantity: 1, partNumber: "SSD-1T-I-P4510", slot: "NVMe 0" },
            { type: "SSD", manufacturer: "Intel", model: "P4510 1TB NVMe SSD", quantity: 1, partNumber: "SSD-1T-I-P4510", slot: "NVMe 1" },
            { type: "SSD", manufacturer: "Intel", model: "P4510 1TB NVMe SSD", quantity: 1, partNumber: "SSD-1T-I-P4510", slot: "NVMe 2" },
            { type: "SSD", manufacturer: "Intel", model: "P4510 1TB NVMe SSD", quantity: 1, partNumber: "SSD-1T-I-P4510", slot: "NVMe 3" },
            { type: "网卡", manufacturer: "Mellanox", model: "ConnectX-5 25GbE", quantity: 1, partNumber: "NIC-MEL-CX5", slot: "PCIe 1" },
            { type: "网卡", manufacturer: "Mellanox", model: "ConnectX-5 25GbE", quantity: 1, partNumber: "NIC-MEL-CX5", slot: "PCIe 2" },
        ],
      },
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
        serialNumber: "SN-003",
        status: "待处理",
        location: {
          module: "C3",
          rack: "R21",
          uPosition: 3,
        },
        currentConfig: [
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB HDD", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 1" },
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB HDD", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 2" },
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB HDD", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 3" },
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB HDD", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 4" },
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB HDD", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 5" },
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB HDD", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 6" },
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB HDD", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 7" },
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB HDD", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 8" },
        ],
        targetConfig: [
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB HDD", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 1" },
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB HDD", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 2" },
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB HDD", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 3" },
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB HDD", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 4" },
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB HDD", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 5" },
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB HDD", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 6" },
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB HDD", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 7" },
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB HDD", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 8" },
          { type: "SSD", manufacturer: "Samsung", model: "PM883 960GB SSD", quantity: 1, partNumber: "SSD-960G-S-PM883", slot: "Bay 9" },
          { type: "SSD", manufacturer: "Samsung", model: "PM883 960GB SSD", quantity: 1, partNumber: "SSD-960G-S-PM883", slot: "Bay 10" },
          { type: "SSD", manufacturer: "Samsung", model: "PM883 960GB SSD", quantity: 1, partNumber: "SSD-960G-S-PM883", slot: "Bay 11" },
          { type: "SSD", manufacturer: "Samsung", model: "PM883 960GB SSD", quantity: 1, partNumber: "SSD-960G-S-PM883", slot: "Bay 12" },
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
        serialNumber: "SN-004",
        status: "待处理",
        location: {
          module: "A1",
          rack: "R18",
          uPosition: 30,
        },
        currentConfig: [
            { type: "CPU", manufacturer: "Intel", model: "Xeon E5-2620v3", quantity: 1, partNumber: "CPU-INT-2620V3", slot: "CPU 1"},
            { type: "CPU", manufacturer: "Intel", model: "Xeon E5-2620v3", quantity: 1, partNumber: "CPU-INT-2620V3", slot: "CPU 2"},
            { type: "内存", manufacturer: "Crucial", model: "16GB DDR4 2133MHz", quantity: 1, partNumber: "MEM-16G-2133-C", slot: "A1" },
            { type: "内存", manufacturer: "Crucial", model: "16GB DDR4 2133MHz", quantity: 1, partNumber: "MEM-16G-2133-C", slot: "A2" },
            { type: "内存", manufacturer: "Crucial", model: "16GB DDR4 2133MHz", quantity: 1, partNumber: "MEM-16G-2133-C", slot: "B1" },
            { type: "内存", manufacturer: "Crucial", model: "16GB DDR4 2133MHz", quantity: 1, partNumber: "MEM-16G-2133-C", slot: "B2" },
        ],
        targetConfig: [],
      },
      {
        id: "dev-007",
        type: "服务器",
        model: "Dell PowerEdge R630",
        serialNumber: "SN-005",
        status: "待处理",
        location: {
          module: "A1",
          rack: "R18",
          uPosition: 31,
        },
        currentConfig: [
            { type: "CPU", manufacturer: "Intel", model: "Xeon E5-2620v3", quantity: 1, partNumber: "CPU-INT-2620V3", slot: "CPU 1"},
            { type: "CPU", manufacturer: "Intel", model: "Xeon E5-2620v3", quantity: 1, partNumber: "CPU-INT-2620V3", slot: "CPU 2"},
            { type: "内存", manufacturer: "Crucial", model: "16GB DDR4 2133MHz", quantity: 1, partNumber: "MEM-16G-2133-C", slot: "A1" },
            { type: "内存", manufacturer: "Crucial", model: "16GB DDR4 2133MHz", quantity: 1, partNumber: "MEM-16G-2133-C", slot: "A2" },
            { type: "内存", manufacturer: "Crucial", model: "16GB DDR4 2133MHz", quantity: 1, partNumber: "MEM-16G-2133-C", slot: "B1" },
            { type: "内存", manufacturer: "Crucial", model: "16GB DDR4 2133MHz", quantity: 1, partNumber: "MEM-16G-2133-C", slot: "B2" },
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
        serialNumber: "SN-006",
        status: "待处理",
        location: { module: "C1", rack: "R01", uPosition: 10 },
        currentConfig: [
          { type: "CPU", manufacturer: "Intel", model: "Xeon Gold 6330", quantity: 1, partNumber: "CPU-INT-6330", slot: "CPU 1" },
          { type: "CPU", manufacturer: "Intel", model: "Xeon Gold 6330", quantity: 1, partNumber: "CPU-INT-6330", slot: "CPU 2" },
          { type: "内存", manufacturer: "Hynix", model: "16GB DDR4 2400MHz", quantity: 1, partNumber: "MEM-16G-2400-A", slot: "A1" },
          { type: "SSD", manufacturer: "Intel", model: "P5510 3.84TB NVMe", quantity: 1, partNumber: "SSD-3.84T-I-P5510", slot: "NVMe 0" },
        ],
        targetConfig: [
          { type: "CPU", manufacturer: "Intel", model: "Xeon Gold 6330", quantity: 1, partNumber: "CPU-INT-6330", slot: "CPU 1" },
          { type: "CPU", manufacturer: "Intel", model: "Xeon Gold 6330", quantity: 1, partNumber: "CPU-INT-6330", slot: "CPU 2" },
          { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A1" },
          { type: "SSD", manufacturer: "Intel", model: "P5510 3.84TB NVMe", quantity: 1, partNumber: "SSD-3.84T-I-P5510", slot: "NVMe 0" },
        ],
      },
      {
        id: "dev-009",
        type: "服务器",
        model: "Dell PowerEdge R650",
        serialNumber: "SN-007",
        status: "待处理",
        location: { module: "C1", rack: "R01", uPosition: 11 },
        currentConfig: [],
        targetConfig: [
          { type: "CPU", manufacturer: "Intel", model: "Xeon Gold 6330", quantity: 1, partNumber: "CPU-INT-6330", slot: "CPU 1" },
          { type: "CPU", manufacturer: "Intel", model: "Xeon Gold 6330", quantity: 1, partNumber: "CPU-INT-6330", slot: "CPU 2" },
          { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A1" },
          { type: "SSD", manufacturer: "Intel", model: "P5510 3.84TB NVMe", quantity: 1, partNumber: "SSD-3.84T-I-P5510", slot: "NVMe 0" },
        ],
      },
      {
        id: "dev-010",
        type: "服务器",
        model: "HPE ProLiant DL360 Gen10",
        serialNumber: "SN-008",
        status: "待处理",
        location: { module: "C1", rack: "R02", uPosition: 15 },
        currentConfig: [],
        targetConfig: [
          { type: "CPU", manufacturer: "Intel", model: "Xeon Silver 4214", quantity: 1, partNumber: "CPU-INT-4214", slot: "CPU 1" },
          { type: "CPU", manufacturer: "Intel", model: "Xeon Silver 4214", quantity: 1, partNumber: "CPU-INT-4214", slot: "CPU 2" },
          { type: "内存", manufacturer: "HPE", model: "32GB DDR4 2933MHz", quantity: 1, partNumber: "MEM-32G-2933-H", slot: "A1" },
          { type: "SATA", manufacturer: "HPE", model: "1.2TB 10K SAS HDD", quantity: 1, partNumber: "HDD-1.2T-H-10K", slot: "Bay 1" },
        ],
      }
    ]
  }
];


export const workOrders: WorkOrder[] = rawWorkOrders;

    

    
