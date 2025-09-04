
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
    title: "升级 Hyperion-01 集群内存",
    type: "服务器改造",
    status: "已分配",
    assignedTo: [employees[0]],
    devices: [
      // Device 1 (original, modified for '卸' and '装')
      {
        id: "dev-001",
        type: "服务器",
        model: "Dell PowerEdge R740",
        serialNumber: "SN-001",
        status: "待处理",
        location: { module: "A1", rack: "R12", uPosition: 24 },
        currentConfig: [
          { type: "内存", manufacturer: "Hynix", model: "16GB DDR4 2400MHz", quantity: 1, partNumber: "MEM-16G-2400-A", slot: "A1" },
          { type: "内存", manufacturer: "Hynix", model: "16GB DDR4 2400MHz", quantity: 1, partNumber: "MEM-16G-2400-A", slot: "A2" },
          { type: "内存", manufacturer: "Hynix", model: "16GB DDR4 2400MHz", quantity: 1, partNumber: "MEM-16G-2400-A", slot: "A3" },
          { type: "内存", manufacturer: "Hynix", model: "16GB DDR4 2400MHz", quantity: 1, partNumber: "MEM-16G-2400-A", slot: "A4" },
          { type: "SSD", manufacturer: "Samsung", model: "PM883 480GB SSD", quantity: 1, partNumber: "SSD-480G-S-PM883", slot: "Disk 0" },
        ],
        targetConfig: [
          { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A1" },
          { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A2" },
          { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A3" },
          { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A4" },
          { type: "SSD", manufacturer: "Intel", model: "P4510 1TB NVMe SSD", quantity: 1, partNumber: "SSD-1T-I-P4510", slot: "Disk 0" },
        ],
      },
       // Cloned devices to meet the 5+ requirement
      {
        id: "dev-002",
        type: "服务器",
        model: "Dell PowerEdge R740",
        serialNumber: "SN-002",
        status: "待处理",
        location: { module: "A1", rack: "R12", uPosition: 25 },
        currentConfig: [
          { type: "内存", manufacturer: "Hynix", model: "16GB DDR4 2400MHz", quantity: 1, partNumber: "MEM-16G-2400-A", slot: "A1" },
          { type: "内存", manufacturer: "Hynix", model: "16GB DDR4 2400MHz", quantity: 1, partNumber: "MEM-16G-2400-A", slot: "A2" },
          { type: "SSD", manufacturer: "Samsung", model: "PM883 480GB SSD", quantity: 1, partNumber: "SSD-480G-S-PM883", slot: "Disk 0" },
        ],
        targetConfig: [
          { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A1" },
          { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A2" },
          { type: "SSD", manufacturer: "Intel", model: "P4510 1TB NVMe SSD", quantity: 1, partNumber: "SSD-1T-I-P4510", slot: "Disk 0" },
        ],
      },
      {
        id: "dev-003",
        type: "服务器",
        model: "Dell PowerEdge R740",
        serialNumber: "SN-003",
        status: "待处理",
        location: { module: "A1", rack: "R12", uPosition: 26 },
        currentConfig: [
          { type: "内存", manufacturer: "Hynix", model: "16GB DDR4 2400MHz", quantity: 1, partNumber: "MEM-16G-2400-A", slot: "A1" },
          { type: "SSD", manufacturer: "Samsung", model: "PM883 480GB SSD", quantity: 1, partNumber: "SSD-480G-S-PM883", slot: "Disk 0" },
        ],
        targetConfig: [
          { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A1" },
          { type: "SSD", manufacturer: "Intel", model: "P4510 1TB NVMe SSD", quantity: 1, partNumber: "SSD-1T-I-P4510", slot: "Disk 0" },
        ],
      },
      {
        id: "dev-004",
        type: "服务器",
        model: "Dell PowerEdge R740",
        serialNumber: "SN-004",
        status: "待处理",
        location: { module: "A1", rack: "R12", uPosition: 27 },
        currentConfig: [
          { type: "内存", manufacturer: "Hynix", model: "16GB DDR4 2400MHz", quantity: 1, partNumber: "MEM-16G-2400-A", slot: "A1" },
          { type: "SSD", manufacturer: "Samsung", model: "PM883 480GB SSD", quantity: 1, partNumber: "SSD-480G-S-PM883", slot: "Disk 0" },
        ],
        targetConfig: [
          { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A1" },
          { type: "SSD", manufacturer: "Intel", model: "P4510 1TB NVMe SSD", quantity: 1, partNumber: "SSD-1T-I-P4510", slot: "Disk 0" },
        ],
      },
      {
        id: "dev-005",
        type: "服务器",
        model: "Dell PowerEdge R740",
        serialNumber: "SN-005",
        status: "待处理",
        location: { module: "A1", rack: "R12", uPosition: 28 },
        currentConfig: [
          { type: "内存", manufacturer: "Hynix", model: "16GB DDR4 2400MHz", quantity: 1, partNumber: "MEM-16G-2400-A", slot: "A1" },
          { type: "SSD", manufacturer: "Samsung", model: "PM883 480GB SSD", quantity: 1, partNumber: "SSD-480G-S-PM883", slot: "Disk 0" },
        ],
        targetConfig: [
          { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A1" },
          { type: "SSD", manufacturer: "Intel", model: "P4510 1TB NVMe SSD", quantity: 1, partNumber: "SSD-1T-I-P4510", slot: "Disk 0" },
        ],
      },
    ],
  },
  {
    id: "wo-002",
    title: "部署新 Web 服务器集群",
    type: "新服务器部署",
    status: "进行中",
    assignedTo: [employees[0], employees[2]],
    devices: [
       // Device 1 (modified for '卸' and '装')
      {
        id: "dev-006",
        type: "服务器",
        model: "HPE ProLiant DL380 Gen10",
        serialNumber: "SN-006",
        status: "待处理",
        location: { module: "B2", rack: "R05", uPosition: 12 },
        currentConfig: [ // Added temporary/old components to be removed
          { type: "内存", manufacturer: "Crucial", model: "8GB DDR4 2133MHz", quantity: 1, partNumber: "MEM-8G-2133-C", slot: "A1" },
          { type: "SATA", manufacturer: "WD", model: "Blue 1TB HDD", quantity: 1, partNumber: "HDD-1T-WD-BLUE", slot: "Bay 1" },
        ],
        targetConfig: [
            { type: "CPU", manufacturer: "Intel", model: "Xeon Silver 4210", quantity: 1, partNumber: "CPU-INT-4210", slot: "CPU 1"},
            { type: "CPU", manufacturer: "Intel", model: "Xeon Silver 4210", quantity: 1, partNumber: "CPU-INT-4210", slot: "CPU 2"},
            { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A1" },
            { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A2" },
            { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A3" },
            { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A4" },
            { type: "SSD", manufacturer: "Intel", model: "P4510 1TB NVMe SSD", quantity: 1, partNumber: "SSD-1T-I-P4510", slot: "NVMe 0" },
            { type: "SSD", manufacturer: "Intel", model: "P4510 1TB NVMe SSD", quantity: 1, partNumber: "SSD-1T-I-P4510", slot: "NVMe 1" },
            { type: "网卡", manufacturer: "Mellanox", model: "ConnectX-5 25GbE", quantity: 1, partNumber: "NIC-MEL-CX5", slot: "PCIe 1" },
        ],
      },
      // Cloned devices
      {
        id: "dev-007",
        type: "服务器",
        model: "HPE ProLiant DL380 Gen10",
        serialNumber: "SN-007",
        status: "待处理",
        location: { module: "B2", rack: "R05", uPosition: 13 },
        currentConfig: [],
        targetConfig: [
            { type: "CPU", manufacturer: "Intel", model: "Xeon Silver 4210", quantity: 1, partNumber: "CPU-INT-4210", slot: "CPU 1"},
            { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A1" },
            { type: "SSD", manufacturer: "Intel", model: "P4510 1TB NVMe SSD", quantity: 1, partNumber: "SSD-1T-I-P4510", slot: "NVMe 0" },
            { type: "网卡", manufacturer: "Mellanox", model: "ConnectX-5 25GbE", quantity: 1, partNumber: "NIC-MEL-CX5", slot: "PCIe 1" },
        ],
      },
       {
        id: "dev-008",
        type: "服务器",
        model: "HPE ProLiant DL380 Gen10",
        serialNumber: "SN-008",
        status: "待处理",
        location: { module: "B2", rack: "R05", uPosition: 14 },
        currentConfig: [],
        targetConfig: [
            { type: "CPU", manufacturer: "Intel", model: "Xeon Silver 4210", quantity: 1, partNumber: "CPU-INT-4210", slot: "CPU 1"},
            { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A1" },
            { type: "SSD", manufacturer: "Intel", model: "P4510 1TB NVMe SSD", quantity: 1, partNumber: "SSD-1T-I-P4510", slot: "NVMe 0" },
            { type: "网卡", manufacturer: "Mellanox", model: "ConnectX-5 25GbE", quantity: 1, partNumber: "NIC-MEL-CX5", slot: "PCIe 1" },
        ],
      },
       {
        id: "dev-009",
        type: "服务器",
        model: "HPE ProLiant DL380 Gen10",
        serialNumber: "SN-009",
        status: "待处理",
        location: { module: "B2", rack: "R05", uPosition: 15 },
        currentConfig: [],
        targetConfig: [
            { type: "CPU", manufacturer: "Intel", model: "Xeon Silver 4210", quantity: 1, partNumber: "CPU-INT-4210", slot: "CPU 1"},
            { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A1" },
            { type: "SSD", manufacturer: "Intel", model: "P4510 1TB NVMe SSD", quantity: 1, partNumber: "SSD-1T-I-P4510", slot: "NVMe 0" },
            { type: "网卡", manufacturer: "Mellanox", model: "ConnectX-5 25GbE", quantity: 1, partNumber: "NIC-MEL-CX5", slot: "PCIe 1" },
        ],
      },
       {
        id: "dev-010",
        type: "服务器",
        model: "HPE ProLiant DL380 Gen10",
        serialNumber: "SN-010",
        status: "待处理",
        location: { module: "B2", rack: "R05", uPosition: 16 },
        currentConfig: [],
        targetConfig: [
            { type: "CPU", manufacturer: "Intel", model: "Xeon Silver 4210", quantity: 1, partNumber: "CPU-INT-4210", slot: "CPU 1"},
            { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A1" },
            { type: "SSD", manufacturer: "Intel", model: "P4510 1TB NVMe SSD", quantity: 1, partNumber: "SSD-1T-I-P4510", slot: "NVMe 0" },
            { type: "网卡", manufacturer: "Mellanox", model: "ConnectX-5 25GbE", quantity: 1, partNumber: "NIC-MEL-CX5", slot: "PCIe 1" },
        ],
      },
    ],
  },
  {
    id: "wo-004",
    title: "为 Prometheus 集群升级存储",
    type: "服务器改造",
    status: "已完成",
    assignedTo: [employees[3]],
    devices: [
      // Device 1 (modified for '卸' and '装')
      {
        id: "dev-011",
        type: "服务器",
        model: "Supermicro 2029U-TR4",
        serialNumber: "SN-011",
        status: "待处理",
        location: { module: "C3", rack: "R21", uPosition: 3 },
        currentConfig: [
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB HDD", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 1" },
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB HDD", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 2" },
        ],
        targetConfig: [
          { type: "SSD", manufacturer: "Samsung", model: "PM883 960GB SSD", quantity: 1, partNumber: "SSD-960G-S-PM883", slot: "Bay 1" },
          { type: "SSD", manufacturer: "Samsung", model: "PM883 960GB SSD", quantity: 1, partNumber: "SSD-960G-S-PM883", slot: "Bay 2" },
          { type: "SSD", manufacturer: "Samsung", model: "PM883 960GB SSD", quantity: 1, partNumber: "SSD-960G-S-PM883", slot: "Bay 3" },
        ],
      },
      // Cloned devices
       {
        id: "dev-012",
        type: "服务器",
        model: "Supermicro 2029U-TR4",
        serialNumber: "SN-012",
        status: "待处理",
        location: { module: "C3", rack: "R21", uPosition: 4 },
        currentConfig: [
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB HDD", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 1" },
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB HDD", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 2" },
        ],
        targetConfig: [
          { type: "SSD", manufacturer: "Samsung", model: "PM883 960GB SSD", quantity: 1, partNumber: "SSD-960G-S-PM883", slot: "Bay 1" },
        ],
      },
       {
        id: "dev-013",
        type: "服务器",
        model: "Supermicro 2029U-TR4",
        serialNumber: "SN-013",
        status: "待处理",
        location: { module: "C3", rack: "R21", uPosition: 5 },
        currentConfig: [
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB HDD", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 1" },
        ],
        targetConfig: [
          { type: "SSD", manufacturer: "Samsung", model: "PM883 960GB SSD", quantity: 1, partNumber: "SSD-960G-S-PM883", slot: "Bay 1" },
          { type: "SSD", manufacturer: "Samsung", model: "PM883 960GB SSD", quantity: 1, partNumber: "SSD-960G-S-PM883", slot: "Bay 2" },
        ],
      },
       {
        id: "dev-014",
        type: "服务器",
        model: "Supermicro 2029U-TR4",
        serialNumber: "SN-014",
        status: "待处理",
        location: { module: "C3", rack: "R21", uPosition: 6 },
        currentConfig: [
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB HDD", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 1" },
        ],
        targetConfig: [
          { type: "SSD", manufacturer: "Samsung", model: "PM883 960GB SSD", quantity: 1, partNumber: "SSD-960G-S-PM883", slot: "Bay 1" },
        ],
      },
       {
        id: "dev-015",
        type: "服务器",
        model: "Supermicro 2029U-TR4",
        serialNumber: "SN-015",
        status: "待处理",
        location: { module: "C3", rack: "R21", uPosition: 7 },
        currentConfig: [
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB HDD", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 1" },
        ],
        targetConfig: [
          { type: "SSD", manufacturer: "Samsung", model: "PM883 960GB SSD", quantity: 1, partNumber: "SSD-960G-S-PM883", slot: "Bay 1" },
        ],
      },
    ],
  },
  {
    id: "wo-005",
    title: "整合 Rhea 集群并升级",
    type: "服务器改造",
    status: "待处理",
    assignedTo: [],
    devices: [
       // Device 1 (modified for '卸' and '装')
      {
        id: "dev-016",
        type: "服务器",
        model: "Dell PowerEdge R630",
        serialNumber: "SN-016",
        status: "待处理",
        location: { module: "A1", rack: "R18", uPosition: 30 },
        currentConfig: [
            { type: "CPU", manufacturer: "Intel", model: "Xeon E5-2620v3", quantity: 1, partNumber: "CPU-INT-2620V3", slot: "CPU 1"},
            { type: "内存", manufacturer: "Crucial", model: "16GB DDR4 2133MHz", quantity: 1, partNumber: "MEM-16G-2133-C", slot: "A1" },
        ],
        targetConfig: [
            { type: "CPU", manufacturer: "Intel", model: "Xeon E5-2650v4", quantity: 1, partNumber: "CPU-INT-2650V4", slot: "CPU 1"},
            { type: "CPU", manufacturer: "Intel", model: "Xeon E5-2650v4", quantity: 1, partNumber: "CPU-INT-2650V4", slot: "CPU 2"},
            { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A1" },
            { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A2" },
        ],
      },
       // Device 2 (modified for '卸' and '装')
      {
        id: "dev-017",
        type: "服务器",
        model: "Dell PowerEdge R630",
        serialNumber: "SN-017",
        status: "待处理",
        location: { module: "A1", rack: "R18", uPosition: 31 },
        currentConfig: [
            { type: "CPU", manufacturer: "Intel", model: "Xeon E5-2620v3", quantity: 1, partNumber: "CPU-INT-2620V3", slot: "CPU 1"},
            { type: "内存", manufacturer: "Crucial", model: "16GB DDR4 2133MHz", quantity: 1, partNumber: "MEM-16G-2133-C", slot: "A1" },
        ],
        targetConfig: [
            { type: "CPU", manufacturer: "Intel", model: "Xeon E5-2650v4", quantity: 1, partNumber: "CPU-INT-2650V4", slot: "CPU 1"},
            { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A1" },
        ],
      },
      // Cloned devices
      {
        id: "dev-018",
        type: "服务器",
        model: "Dell PowerEdge R630",
        serialNumber: "SN-018",
        status: "待处理",
        location: { module: "A1", rack: "R18", uPosition: 32 },
        currentConfig: [
            { type: "CPU", manufacturer: "Intel", model: "Xeon E5-2620v3", quantity: 1, partNumber: "CPU-INT-2620V3", slot: "CPU 1"},
        ],
        targetConfig: [
            { type: "CPU", manufacturer: "Intel", model: "Xeon E5-2650v4", quantity: 1, partNumber: "CPU-INT-2650V4", slot: "CPU 1"},
            { type: "内存", manufacturer: "Samsung", model: "32GB DDR4 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A1" },
        ],
      },
      {
        id: "dev-019",
        type: "服务器",
        model: "Dell PowerEdge R630",
        serialNumber: "SN-019",
        status: "待处理",
        location: { module: "A1", rack: "R18", uPosition: 33 },
        currentConfig: [
            { type: "CPU", manufacturer: "Intel", model: "Xeon E5-2620v3", quantity: 1, partNumber: "CPU-INT-2620V3", slot: "CPU 1"},
        ],
        targetConfig: [
            { type: "CPU", manufacturer: "Intel", model: "Xeon E5-2650v4", quantity: 1, partNumber: "CPU-INT-2650V4", slot: "CPU 1"},
        ],
      },
      {
        id: "dev-020",
        type: "服务器",
        model: "Dell PowerEdge R630",
        serialNumber: "SN-020",
        status: "待处理",
        location: { module: "A1", rack: "R18", uPosition: 34 },
        currentConfig: [
            { type: "CPU", manufacturer: "Intel", model: "Xeon E5-2620v3", quantity: 1, partNumber: "CPU-INT-2620V3", slot: "CPU 1"},
        ],
        targetConfig: [
            { type: "CPU", manufacturer: "Intel", model: "Xeon E5-2650v4", quantity: 1, partNumber: "CPU-INT-2650V4", slot: "CPU 1"},
        ],
      },
    ],
  },
];


export const workOrders: WorkOrder[] = rawWorkOrders;
