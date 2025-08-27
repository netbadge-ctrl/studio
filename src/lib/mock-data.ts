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
        model: "Dell PowerEdge R740",
        serialNumber: "SN-A7B3C9D1E5",
        location: {
          module: "A1",
          rack: "R12",
          uPosition: 24,
        },
        currentConfig: [
          { type: "内存", manufacturer: "Hynix", model: "DDR4 16GB 2400MHz", quantity: 1, partNumber: "MEM-16G-2400-A", slot: "A1" },
          { type: "内存", manufacturer: "Hynix", model: "DDR4 16GB 2400MHz", quantity: 1, partNumber: "MEM-16G-2400-A", slot: "A2" },
          { type: "内存", manufacturer: "Hynix", model: "DDR4 16GB 2400MHz", quantity: 1, partNumber: "MEM-16G-2400-A", slot: "A3" },
          { type: "内存", manufacturer: "Hynix", model: "DDR4 16GB 2400MHz", quantity: 1, partNumber: "MEM-16G-2400-A", slot: "A4" },
          { type: "SSD", manufacturer: "Samsung", model: "PM883 480GB", quantity: 1, partNumber: "SSD-480G-S-PM883", slot: "Disk 0" },
          { type: "SSD", manufacturer: "Samsung", model: "PM883 480GB", quantity: 1, partNumber: "SSD-480G-S-PM883", slot: "Disk 1" },
        ],
        targetConfig: [
          { type: "内存", manufacturer: "Samsung", model: "DDR4 32GB 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A1" },
          { type: "内存", manufacturer: "Samsung", model: "DDR4 32GB 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A2" },
          { type: "内存", manufacturer: "Samsung", model: "DDR4 32GB 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A3" },
          { type: "内存", manufacturer: "Samsung", model: "DDR4 32GB 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A4" },
          { type: "SSD", manufacturer: "Samsung", model: "PM883 480GB", quantity: 1, partNumber: "SSD-480G-S-PM883", slot: "Disk 0" },
          { type: "SSD", manufacturer: "Samsung", model: "PM883 480GB", quantity: 1, partNumber: "SSD-480G-S-PM883", slot: "Disk 1" },
        ],
        sop: [
          { step: 1, action: "验证服务器序列号", completed: false },
          { step: 2, action: "安全停机并断开电源", completed: false },
          { step: 3, action: "移除 A1-A4 槽位的 16GB 内存条", completed: false },
          { step: 4, action: "在 A1-A4 槽位安装新的 32GB 内存条", completed: false },
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
        model: "HPE ProLiant DL380 Gen10",
        serialNumber: "SN-F2G8H4I6J1",
        location: {
          module: "B2",
          rack: "R05",
          uPosition: 12,
        },
        currentConfig: [],
        targetConfig: [
            { type: "CPU", manufacturer: "Intel", model: "Xeon Silver 4210", quantity: 1, partNumber: "CPU-INT-4210", slot: "CPU 1"},
            { type: "CPU", manufacturer: "Intel", model: "Xeon Silver 4210", quantity: 1, partNumber: "CPU-INT-4210", slot: "CPU 2"},
            { type: "内存", manufacturer: "Samsung", model: "DDR4 32GB 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A1" },
            { type: "内存", manufacturer: "Samsung", model: "DDR4 32GB 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A2" },
            { type: "内存", manufacturer: "Samsung", model: "DDR4 32GB 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A3" },
            { type: "内存", manufacturer: "Samsung", model: "DDR4 32GB 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A4" },
            { type: "内存", manufacturer: "Samsung", model: "DDR4 32GB 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "B1" },
            { type: "内存", manufacturer: "Samsung", model: "DDR4 32GB 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "B2" },
            { type: "内存", manufacturer: "Samsung", model: "DDR4 32GB 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "B3" },
            { type: "内存", manufacturer: "Samsung", model: "DDR4 32GB 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "B4" },
            { type: "SSD", manufacturer: "Intel", model: "P4510 1TB NVMe", quantity: 1, partNumber: "SSD-1T-I-P4510", slot: "NVMe 0" },
            { type: "SSD", manufacturer: "Intel", model: "P4510 1TB NVMe", quantity: 1, partNumber: "SSD-1T-I-P4510", slot: "NVMe 1" },
            { type: "SSD", manufacturer: "Intel", model: "P4510 1TB NVMe", quantity: 1, partNumber: "SSD-1T-I-P4510", slot: "NVMe 2" },
            { type: "SSD", manufacturer: "Intel", model: "P4510 1TB NVMe", quantity: 1, partNumber: "SSD-1T-I-P4510", slot: "NVMe 3" },
            { type: "网卡", manufacturer: "Mellanox", model: "CX-5 25GbE", quantity: 1, partNumber: "NIC-MEL-CX5", slot: "PCIe 1" },
            { type: "网卡", manufacturer: "Mellanox", model: "CX-5 25GbE", quantity: 1, partNumber: "NIC-MEL-CX5", slot: "PCIe 2" },
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
        model: "Cisco Nexus 93180YC-EX",
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
            model: "Arista 7050SX-64",
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
        model: "Supermicro 2029U-TR4",
        serialNumber: "SN-Q8R4S2T7U3",
        location: {
          module: "C3",
          rack: "R21",
          uPosition: 3,
        },
        currentConfig: [
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 1" },
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 2" },
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 3" },
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 4" },
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 5" },
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 6" },
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 7" },
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 8" },
        ],
        targetConfig: [
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 1" },
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 2" },
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 3" },
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 4" },
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 5" },
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 6" },
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 7" },
          { type: "SATA", manufacturer: "Seagate", model: "Exos 4TB", quantity: 1, partNumber: "HDD-4T-S-EXOS", slot: "Bay 8" },
          { type: "SSD", manufacturer: "Samsung", model: "PM883 960GB", quantity: 1, partNumber: "SSD-960G-S-PM883", slot: "Bay 9" },
          { type: "SSD", manufacturer: "Samsung", model: "PM883 960GB", quantity: 1, partNumber: "SSD-960G-S-PM883", slot: "Bay 10" },
          { type: "SSD", manufacturer: "Samsung", model: "PM883 960GB", quantity: 1, partNumber: "SSD-960G-S-PM883", slot: "Bay 11" },
          { type: "SSD", manufacturer: "Samsung", model: "PM883 960GB", quantity: 1, partNumber: "SSD-960G-S-PM883", slot: "Bay 12" },
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
        model: "Dell PowerEdge R630",
        serialNumber: "SN-V6W2X8Y4Z1",
        location: {
          module: "A1",
          rack: "R18",
          uPosition: 30,
        },
        currentConfig: [
            { type: "CPU", manufacturer: "Intel", model: "Xeon E5-2620 v3", quantity: 1, partNumber: "CPU-INT-2620V3", slot: "CPU 1"},
            { type: "CPU", manufacturer: "Intel", model: "Xeon E5-2620 v3", quantity: 1, partNumber: "CPU-INT-2620V3", slot: "CPU 2"},
            { type: "内存", manufacturer: "Crucial", model: "DDR4 16GB 2133MHz", quantity: 1, partNumber: "MEM-16G-2133-C", slot: "A1" },
            { type: "内存", manufacturer: "Crucial", model: "DDR4 16GB 2133MHz", quantity: 1, partNumber: "MEM-16G-2133-C", slot: "A2" },
            { type: "内存", manufacturer: "Crucial", model: "DDR4 16GB 2133MHz", quantity: 1, partNumber: "MEM-16G-2133-C", slot: "B1" },
            { type: "内存", manufacturer: "Crucial", model: "DDR4 16GB 2133MHz", quantity: 1, partNumber: "MEM-16G-2133-C", slot: "B2" },
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
        model: "Dell PowerEdge R630",
        serialNumber: "SN-V6W2X8Y4Z2",
        location: {
          module: "A1",
          rack: "R18",
          uPosition: 31,
        },
        currentConfig: [
            { type: "CPU", manufacturer: "Intel", model: "Xeon E5-2620 v3", quantity: 1, partNumber: "CPU-INT-2620V3", slot: "CPU 1"},
            { type: "CPU", manufacturer: "Intel", model: "Xeon E5-2620 v3", quantity: 1, partNumber: "CPU-INT-2620V3", slot: "CPU 2"},
            { type: "内存", manufacturer: "Crucial", model: "DDR4 16GB 2133MHz", quantity: 1, partNumber: "MEM-16G-2133-C", slot: "A1" },
            { type: "内存", manufacturer: "Crucial", model: "DDR4 16GB 2133MHz", quantity: 1, partNumber: "MEM-16G-2133-C", slot: "A2" },
            { type: "内存", manufacturer: "Crucial", model: "DDR4 16GB 2133MHz", quantity: 1, partNumber: "MEM-16G-2133-C", slot: "B1" },
            { type: "内存", manufacturer: "Crucial", model: "DDR4 16GB 2133MHz", quantity: 1, partNumber: "MEM-16G-2133-C", slot: "B2" },
        ],
        targetConfig: [],
        sop: [
          { step: 1, action: "下架服务器", completed: false },
          { step: 2, action: "擦除数据", completed: false },
        ]
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
        currentConfig: [],
        targetConfig: [
          { type: "CPU", manufacturer: "Intel", model: "Xeon Gold 6330", quantity: 1, partNumber: "CPU-INT-6330", slot: "CPU 1" },
          { type: "CPU", manufacturer: "Intel", model: "Xeon Gold 6330", quantity: 1, partNumber: "CPU-INT-6330", slot: "CPU 2" },
          { type: "内存", manufacturer: "Samsung", model: "DDR4 32GB 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A1" },
          { type: "SSD", manufacturer: "Intel", model: "P5510 3.84TB NVMe", quantity: 1, partNumber: "SSD-3.84T-I-P5510", slot: "NVMe 0" },
        ],
        sop: [{ step: 1, action: "上架并连接电源", completed: false }, { step: 2, action: "配置 iDRAC", completed: false }]
      },
      {
        id: "dev-009",
        type: "服务器",
        model: "Dell PowerEdge R650",
        serialNumber: "SN-DELL-R650-02",
        location: { module: "C1", rack: "R01", uPosition: 11 },
        currentConfig: [],
        targetConfig: [
          { type: "CPU", manufacturer: "Intel", model: "Xeon Gold 6330", quantity: 1, partNumber: "CPU-INT-6330", slot: "CPU 1" },
          { type: "CPU", manufacturer: "Intel", model: "Xeon Gold 6330", quantity: 1, partNumber: "CPU-INT-6330", slot: "CPU 2" },
          { type: "内存", manufacturer: "Samsung", model: "DDR4 32GB 3200MHz", quantity: 1, partNumber: "MEM-32G-3200-B", slot: "A1" },
          { type: "SSD", manufacturer: "Intel", model: "P5510 3.84TB NVMe", quantity: 1, partNumber: "SSD-3.84T-I-P5510", slot: "NVMe 0" },
        ],
        sop: [{ step: 1, action: "上架并连接电源", completed: false }, { step: 2, action: "配置 iDRAC", completed: false }]
      },
      {
        id: "dev-010",
        type: "服务器",
        model: "HPE ProLiant DL360 Gen10",
        serialNumber: "SN-HPE-DL360-01",
        location: { module: "C1", rack: "R02", uPosition: 15 },
        currentConfig: [],
        targetConfig: [
          { type: "CPU", manufacturer: "Intel", model: "Xeon Silver 4214", quantity: 1, partNumber: "CPU-INT-4214", slot: "CPU 1" },
          { type: "CPU", manufacturer: "Intel", model: "Xeon Silver 4214", quantity: 1, partNumber: "CPU-INT-4214", slot: "CPU 2" },
          { type: "内存", manufacturer: "HPE", model: "DDR4 32GB 2933MHz", quantity: 1, partNumber: "MEM-32G-2933-H", slot: "A1" },
          { type: "SATA", manufacturer: "HPE", model: "1.2TB SAS 10K", quantity: 1, partNumber: "HDD-1.2T-H-10K", slot: "Bay 1" },
        ],
        sop: [{ step: 1, action: "上架并连接电源", completed: false }, { step: 2, action: "配置 iLO", completed: false }]
      },
      {
        id: "dev-011",
        type: "交换机",
        model: "Cisco Nexus 93108TC-EX",
        serialNumber: "SN-CIS-93108-01",
        location: { module: "C1", rack: "R01", uPosition: 22 },
        currentConfig: [],
        targetConfig: [],
        sop: [{ step: 1, action: "安装到ToR位置", completed: false }, { step: 2, action: "连接上行和服务器", completed: false }]
      },
      {
        id: "dev-012",
        type: "交换机",
        model: "Cisco Nexus 93108TC-EX",
        serialNumber: "SN-CIS-93108-02",
        location: { module: "C1", rack: "R02", uPosition: 22 },
        currentConfig: [],
        targetConfig: [],
        sop: [{ step: 1, action: "安装到ToR位置", completed: false }, { step: 2, action: "连接上行和服务器", completed: false }]
      },
      {
        id: "dev-013",
        type: "存储设备",
        model: "NetApp FAS2750",
        serialNumber: "SN-NTAP-2750-01",
        location: { module: "C1", rack: "R03", uPosition: 5 },
        currentConfig: [],
        targetConfig: [
          { type: "SSD", manufacturer: "NetApp", model: "960GB SSD", quantity: 1, partNumber: "SSD-960G-N", slot: "Disk 1" },
          { type: "SSD", manufacturer: "NetApp", model: "960GB SSD", quantity: 1, partNumber: "SSD-960G-N", slot: "Disk 2" },
          { type: "SSD", manufacturer: "NetApp", model: "960GB SSD", quantity: 1, partNumber: "SSD-960G-N", slot: "Disk 3" },
          { type: "SSD", manufacturer: "NetApp", model: "960GB SSD", quantity: 1, partNumber: "SSD-960G-N", slot: "Disk 4" },
        ],
        sop: [{ step: 1, action: "上架并配置存储", completed: false }]
      }
    ]
  }
];
