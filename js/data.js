/**
 * Initial Default Data and Configurations for TSG Business Suite
 */

const INITIAL_DATA = {
    // Admin Security Configuration
    config: {
        adminPin: "1234", // Default PIN
        storeName: "TSG Tobacconist & Vape Express",
        currency: "$",
        taxRate: 0.0, // 0% default or editable
        enableMultiBuy: true
    },

    // 1. TSG DAILY SHEET (Daily Sales & Stock)
    tsgDaily: [
        // Category: Cheap PP
        { id: "tsg_1", category: "Cheap PP", name: "R", stock: 100, soldPack: 0, soldCtn: 0, packPrice: 12, ctnPrice: 120, formula: "pack * price + ctn * ctnPrice" },
        { id: "tsg_2", category: "Cheap PP", name: "B", stock: 100, soldPack: 0, soldCtn: 0, packPrice: 12, ctnPrice: 120, formula: "pack * price + ctn * ctnPrice" },
        { id: "tsg_3", category: "Cheap PP", name: "Crush", stock: 100, soldPack: 0, soldCtn: 0, packPrice: 12, ctnPrice: 120, formula: "pack * price + ctn * ctnPrice" },
        { id: "tsg_4", category: "Cheap PP", name: "Cheap 25g", stock: 80, soldPack: 0, soldCtn: 0, packPrice: 20, ctnPrice: 180, formula: "pack * price + ctn * ctnPrice" },
        { id: "tsg_5", category: "Cheap PP", name: "Stellar Royal", stock: 50, soldPack: 0, soldCtn: 0, packPrice: 36, ctnPrice: 350, formula: "pack * price + ctn * ctnPrice" },
        
        // Category: Cigarette Packs & Cartons
        { id: "tsg_6", category: "Packs & Cartons", name: "xx", stock: 60, soldPack: 0, soldCtn: 0, packPrice: 15, ctnPrice: 150, formula: "pack * price + ctn * ctnPrice" },
        { id: "tsg_7", category: "Packs & Cartons", name: "EL", stock: 60, soldPack: 0, soldCtn: 0, packPrice: 15, ctnPrice: 150, formula: "pack * price + ctn * ctnPrice" },
        { id: "tsg_8", category: "Packs & Cartons", name: "EM", stock: 60, soldPack: 0, soldCtn: 0, packPrice: 15, ctnPrice: 150, formula: "pack * price + ctn * ctnPrice" },
        { id: "tsg_9", category: "Packs & Cartons", name: "EC", stock: 60, soldPack: 0, soldCtn: 0, packPrice: 15, ctnPrice: 150, formula: "pack * price + ctn * ctnPrice" },
        { id: "tsg_10", category: "Packs & Cartons", name: "Man. Lights", stock: 50, soldPack: 0, soldCtn: 0, packPrice: 12, ctnPrice: 120, formula: "pack * price + ctn * ctnPrice" },
        { id: "tsg_11", category: "Packs & Cartons", name: "Man. Red", stock: 50, soldPack: 0, soldCtn: 0, packPrice: 15, ctnPrice: 150, formula: "pack * price + ctn * ctnPrice" },
        { id: "tsg_12", category: "Packs & Cartons", name: "Man. Reserve", stock: 50, soldPack: 0, soldCtn: 0, packPrice: 15, ctnPrice: 150, formula: "pack * price + ctn * ctnPrice" },
        { id: "tsg_13", category: "Packs & Cartons", name: "Man Saph Blue", stock: 50, soldPack: 0, soldCtn: 0, packPrice: 15, ctnPrice: 150, formula: "pack * price + ctn * ctnPrice" },
        { id: "tsg_14", category: "Packs & Cartons", name: "Man Special Edition", stock: 40, soldPack: 0, soldCtn: 0, packPrice: 15, ctnPrice: 150, formula: "pack * price + ctn * ctnPrice" },
        { id: "tsg_15", category: "Packs & Cartons", name: "Marl. Red", stock: 100, soldPack: 0, soldCtn: 0, packPrice: 15, ctnPrice: 150, formula: "pack * price + ctn * ctnPrice" },
        { id: "tsg_16", category: "Packs & Cartons", name: "Marl. Gold", stock: 100, soldPack: 0, soldCtn: 0, packPrice: 15, ctnPrice: 150, formula: "pack * price + ctn * ctnPrice" },
        { id: "tsg_17", category: "Packs & Cartons", name: "Man Double Drive", stock: 50, soldPack: 0, soldCtn: 0, packPrice: 15, ctnPrice: 150, formula: "pack * price + ctn * ctnPrice" },
        { id: "tsg_18", category: "Packs & Cartons", name: "Kent", stock: 50, soldPack: 0, soldCtn: 0, packPrice: 12, ctnPrice: 120, formula: "pack * price + ctn * ctnPrice" },
        { id: "tsg_19", category: "Packs & Cartons", name: "Mac", stock: 60, soldPack: 0, soldCtn: 0, packPrice: 10, ctnPrice: 100, formula: "pack * price + ctn * ctnPrice" },
        { id: "tsg_20", category: "Packs & Cartons", name: "S. Ice", stock: 70, soldPack: 0, soldCtn: 0, packPrice: 20, ctnPrice: 200, formula: "pack * price + ctn * ctnPrice" },
        { id: "tsg_21", category: "Packs & Cartons", name: "S. Red", stock: 70, soldPack: 0, soldCtn: 0, packPrice: 20, ctnPrice: 200, formula: "pack * price + ctn * ctnPrice" },
        { id: "tsg_22", category: "Packs & Cartons", name: "S. Artic", stock: 70, soldPack: 0, soldCtn: 0, packPrice: 20, ctnPrice: 200, formula: "pack * price + ctn * ctnPrice" },
        { id: "tsg_23", category: "Packs & Cartons", name: "Indian Ciggis", stock: 50, soldPack: 0, soldCtn: 0, packPrice: 15, ctnPrice: 150, formula: "pack * price + ctn * ctnPrice" },
        { id: "tsg_24", category: "Packs & Cartons", name: "Davidoff Red", stock: 60, soldPack: 0, soldCtn: 0, packPrice: 20, ctnPrice: 200, formula: "pack * price + ctn * ctnPrice" },
        { id: "tsg_25", category: "Packs & Cartons", name: "Davidoff Gold", stock: 60, soldPack: 0, soldCtn: 0, packPrice: 15, ctnPrice: 150, formula: "pack * price + ctn * ctnPrice" },
        { id: "tsg_26", category: "Packs & Cartons", name: "DH Blue", stock: 40, soldPack: 0, soldCtn: 0, packPrice: 18, ctnPrice: 180, formula: "pack * price + ctn * ctnPrice" },
        { id: "tsg_27", category: "Packs & Cartons", name: "DH Red", stock: 40, soldPack: 0, soldCtn: 0, packPrice: 25, ctnPrice: 250, formula: "pack * price + ctn * ctnPrice" },
        { id: "tsg_28", category: "Packs & Cartons", name: "Marl IB", stock: 40, soldPack: 0, soldCtn: 0, packPrice: 20, ctnPrice: 200, formula: "pack * price + ctn * ctnPrice" },
        { id: "tsg_29", category: "Packs & Cartons", name: "Marl Switch", stock: 40, soldPack: 0, soldCtn: 0, packPrice: 22, ctnPrice: 220, formula: "pack * price + ctn * ctnPrice" },

        // Category: Vapes & Accessories
        { id: "tsg_30", category: "Vapes & Accessories", name: "Ali #60", stock: 50, soldPack: 0, soldCtn: 0, packPrice: 60, ctnPrice: 550, formula: "pack * price" },
        { id: "tsg_31", category: "Vapes & Accessories", name: "Sniffy Bar", stock: 50, soldPack: 0, soldCtn: 0, packPrice: 10, ctnPrice: 90, formula: "pack * price" },
        { id: "tsg_32", category: "Vapes & Accessories", name: "IGET Bar Pro", stock: 50, soldPack: 0, soldCtn: 0, packPrice: 60, ctnPrice: 550, formula: "pack * price" },
        { id: "tsg_33", category: "Vapes & Accessories", name: "UWELL", stock: 40, soldPack: 0, soldCtn: 0, packPrice: 30, ctnPrice: 100, formula: "multiBuy(pack, 30, 4, 100)" },
        { id: "tsg_34", category: "Vapes & Accessories", name: "Bulubulu", stock: 40, soldPack: 0, soldCtn: 0, packPrice: 25, ctnPrice: 100, formula: "multiBuy(pack, 25, 4, 100)" },
        { id: "tsg_35", category: "Vapes & Accessories", name: "Water Pipe / Bong", stock: 20, soldPack: 0, soldCtn: 0, packPrice: 35, ctnPrice: 50, formula: "pack * price" }
    ],

    // Wholesale & Cashout Daily Summary Items
    wholesaleSummary: [
        { id: "ws_1", name: "Cheap PP Cashout", amount: 0 },
        { id: "ws_2", name: "Gift Carton", amount: 0 },
        { id: "ws_3", name: "Paper / Lighter Sales", amount: 0 },
        { id: "ws_4", name: "Cigar Sales", amount: 0 },
        { id: "ws_5", name: "Vape Sales Direct", amount: 0 },
        { id: "ws_6", name: "Tobacco Bulk", amount: 0 }
    ],

    // 2. DAILY REPORT (4 Weeks Breakdown)
    dailyReports: {
        "Week 1": [
            { day: "Monday", pos: 0, misc: 0, book: 0, realWs: 0, cashout: 0, eftpos: 0, vape: 0, floatCash: 0 },
            { day: "Tuesday", pos: 0, misc: 0, book: 0, realWs: 0, cashout: 0, eftpos: 0, vape: 0, floatCash: 0 },
            { day: "Wednesday", pos: 0, misc: 0, book: 0, realWs: 0, cashout: 0, eftpos: 0, vape: 0, floatCash: 0 },
            { day: "Thursday", pos: 0, misc: 0, book: 0, realWs: 0, cashout: 0, eftpos: 0, vape: 0, floatCash: 0 },
            { day: "Friday", pos: 0, misc: 0, book: 0, realWs: 0, cashout: 0, eftpos: 0, vape: 0, floatCash: 0 },
            { day: "Saturday", pos: 0, misc: 0, book: 0, realWs: 0, cashout: 0, eftpos: 0, vape: 0, floatCash: 0 },
            { day: "Sunday", pos: 0, misc: 0, book: 0, realWs: 0, cashout: 0, eftpos: 0, vape: 0, floatCash: 0 }
        ],
        "Week 2": [
            { day: "Monday", pos: 0, misc: 0, book: 0, realWs: 0, cashout: 0, eftpos: 0, vape: 0, floatCash: 0 },
            { day: "Tuesday", pos: 0, misc: 0, book: 0, realWs: 0, cashout: 0, eftpos: 0, vape: 0, floatCash: 0 },
            { day: "Wednesday", pos: 0, misc: 0, book: 0, realWs: 0, cashout: 0, eftpos: 0, vape: 0, floatCash: 0 },
            { day: "Thursday", pos: 0, misc: 0, book: 0, realWs: 0, cashout: 0, eftpos: 0, vape: 0, floatCash: 0 },
            { day: "Friday", pos: 0, misc: 0, book: 0, realWs: 0, cashout: 0, eftpos: 0, vape: 0, floatCash: 0 },
            { day: "Saturday", pos: 0, misc: 0, book: 0, realWs: 0, cashout: 0, eftpos: 0, vape: 0, floatCash: 0 },
            { day: "Sunday", pos: 0, misc: 0, book: 0, realWs: 0, cashout: 0, eftpos: 0, vape: 0, floatCash: 0 }
        ],
        "Week 3": [
            { day: "Monday", pos: 0, misc: 0, book: 0, realWs: 0, cashout: 0, eftpos: 0, vape: 0, floatCash: 0 },
            { day: "Tuesday", pos: 0, misc: 0, book: 0, realWs: 0, cashout: 0, eftpos: 0, vape: 0, floatCash: 0 },
            { day: "Wednesday", pos: 0, misc: 0, book: 0, realWs: 0, cashout: 0, eftpos: 0, vape: 0, floatCash: 0 },
            { day: "Thursday", pos: 0, misc: 0, book: 0, realWs: 0, cashout: 0, eftpos: 0, vape: 0, floatCash: 0 },
            { day: "Friday", pos: 0, misc: 0, book: 0, realWs: 0, cashout: 0, eftpos: 0, vape: 0, floatCash: 0 },
            { day: "Saturday", pos: 0, misc: 0, book: 0, realWs: 0, cashout: 0, eftpos: 0, vape: 0, floatCash: 0 },
            { day: "Sunday", pos: 0, misc: 0, book: 0, realWs: 0, cashout: 0, eftpos: 0, vape: 0, floatCash: 0 }
        ],
        "Week 4": [
            { day: "Monday", pos: 0, misc: 0, book: 0, realWs: 0, cashout: 0, eftpos: 0, vape: 0, floatCash: 0 },
            { day: "Tuesday", pos: 0, misc: 0, book: 0, realWs: 0, cashout: 0, eftpos: 0, vape: 0, floatCash: 0 },
            { day: "Wednesday", pos: 0, misc: 0, book: 0, realWs: 0, cashout: 0, eftpos: 0, vape: 0, floatCash: 0 },
            { day: "Thursday", pos: 0, misc: 0, book: 0, realWs: 0, cashout: 0, eftpos: 0, vape: 0, floatCash: 0 },
            { day: "Friday", pos: 0, misc: 0, book: 0, realWs: 0, cashout: 0, eftpos: 0, vape: 0, floatCash: 0 },
            { day: "Saturday", pos: 0, misc: 0, book: 0, realWs: 0, cashout: 0, eftpos: 0, vape: 0, floatCash: 0 },
            { day: "Sunday", pos: 0, misc: 0, book: 0, realWs: 0, cashout: 0, eftpos: 0, vape: 0, floatCash: 0 }
        ]
    },

    // 3. OP PRICE MASTER MATRIX
    opPrices: [
        // Category: Cheap PP
        { id: "op_1", category: "Cheap PP", name: "R", pricePack: 12, priceCtn: 120, deal: "10+1 Special" },
        { id: "op_2", category: "Cheap PP", name: "B", pricePack: 12, priceCtn: 120, deal: "10+1 Special" },
        { id: "op_3", category: "Cheap PP", name: "G", pricePack: 12, priceCtn: 120, deal: "10+1 Special" },
        { id: "op_4", category: "Cheap PP", name: "Drum 50g", pricePack: 65, priceCtn: 120, deal: "$65 for 1, $120 for 2" },
        { id: "op_5", category: "Cheap PP", name: "GV 50g", pricePack: 65, priceCtn: 120, deal: "$65 for 1, $120 for 2" },
        { id: "op_6", category: "Cheap PP", name: "Manchester 25g", pricePack: 20, priceCtn: 30, deal: "$20 for 1, $30 for 2" },
        { id: "op_7", category: "Cheap PP", name: "Stellar Royal", pricePack: 36, priceCtn: 70, deal: "$36 for 1, $70 for 2" },

        // Category: Standard Packs
        { id: "op_8", category: "Packs", name: "xx", pricePack: 15, priceCtn: 150, deal: "Carton 10s" },
        { id: "op_9", category: "Packs", name: "EL", pricePack: 15, priceCtn: 150, deal: "Carton 10s" },
        { id: "op_10", category: "Packs", name: "EM", pricePack: 15, priceCtn: 150, deal: "Carton 10s" },
        { id: "op_11", category: "Packs", name: "EC", pricePack: 15, priceCtn: 150, deal: "Carton 10s" },
        { id: "op_12", category: "Packs", name: "Man Light", pricePack: 12, priceCtn: 120, deal: "Carton 10s" },
        { id: "op_13", category: "Packs", name: "Man. Royal Red", pricePack: 15, priceCtn: 150, deal: "Carton 10s" },
        { id: "op_14", category: "Packs", name: "Man. Red", pricePack: 15, priceCtn: 150, deal: "Carton 10s" },
        { id: "op_15", category: "Packs", name: "Man. Reserve", pricePack: 15, priceCtn: 150, deal: "Carton 10s" },
        { id: "op_16", category: "Packs", name: "Man SP. Edition", pricePack: 15, priceCtn: 150, deal: "Carton 10s" },
        { id: "op_17", category: "Packs", name: "Man Saph Blue", pricePack: 15, priceCtn: 150, deal: "Carton 10s" },
        { id: "op_18", category: "Packs", name: "Marl. Red", pricePack: 15, priceCtn: 150, deal: "Carton 10s" },
        { id: "op_19", category: "Packs", name: "Marl. Gold", pricePack: 15, priceCtn: 150, deal: "Carton 10s" },
        { id: "op_20", category: "Packs", name: "Man D. Drive", pricePack: 15, priceCtn: 150, deal: "Carton 10s" },
        { id: "op_21", category: "Packs", name: "Man Silver", pricePack: 15, priceCtn: 150, deal: "Carton 10s" },
        { id: "op_22", category: "Packs", name: "Kent", pricePack: 12, priceCtn: 120, deal: "Carton 10s" },
        { id: "op_23", category: "Packs", name: "Mac", pricePack: 10, priceCtn: 100, deal: "Carton 10s" },
        { id: "op_24", category: "Packs", name: "S. Ice", pricePack: 20, priceCtn: 200, deal: "Carton 10s" },
        { id: "op_25", category: "Packs", name: "S. Red", pricePack: 20, priceCtn: 200, deal: "Carton 10s" },
        { id: "op_26", category: "Packs", name: "S. Artic", pricePack: 20, priceCtn: 200, deal: "Carton 10s" },
        { id: "op_27", category: "Packs", name: "Davidoff Red", pricePack: 20, priceCtn: 200, deal: "Carton 10s" },
        { id: "op_28", category: "Packs", name: "Davidoff Gold", pricePack: 15, priceCtn: 150, deal: "Carton 10s" },
        { id: "op_29", category: "Packs", name: "DH Blue", pricePack: 18, priceCtn: 180, deal: "Carton 10s" },
        { id: "op_30", category: "Packs", name: "DH Red", pricePack: 25, priceCtn: 250, deal: "Carton 10s" },
        { id: "op_31", category: "Packs", name: "Marl IB", pricePack: 20, priceCtn: 200, deal: "Carton 10s" },
        { id: "op_32", category: "Packs", name: "Marl Switch", pricePack: 22, priceCtn: 220, deal: "Carton 10s" },
        { id: "op_33", category: "Packs", name: "Mevius 3", pricePack: 20, priceCtn: 200, deal: "Carton 10s" },
        { id: "op_34", category: "Packs", name: "1 mg", pricePack: 20, priceCtn: 200, deal: "Carton 10s" },
        { id: "op_35", category: "Packs", name: "Jap Marl Gold", pricePack: 20, priceCtn: 200, deal: "Carton 10s" },
        { id: "op_36", category: "Packs", name: "Mevius 5mg", pricePack: 20, priceCtn: 200, deal: "Carton 10s" },
        { id: "op_37", category: "Packs", name: "Mevius 10mg", pricePack: 20, priceCtn: 200, deal: "Carton 10s" },
        { id: "op_38", category: "Packs", name: "Marl_Advance", pricePack: 20, priceCtn: 200, deal: "Carton 10s" },
        { id: "op_39", category: "Packs", name: "Gold Flake", pricePack: 20, priceCtn: 200, deal: "Carton 10s" },

        // Category: Vapes
        { id: "op_40", category: "Vape", name: "IGET_PRO", pricePack: 60, priceCtn: 550, deal: "Single Unit" },
        { id: "op_41", category: "Vape", name: "UWELL", pricePack: 30, priceCtn: 100, deal: "4 for $100" },
        { id: "op_42", category: "Vape", name: "IGET_ONE", pricePack: 60, priceCtn: 550, deal: "Single Unit" },

        // Category: Filters
        { id: "op_43", category: "Filters", name: "URBAN FILTER", pricePack: 2.50, priceCtn: 25.00, deal: "Pack" },
        { id: "op_44", category: "Filters", name: "VENTTI ULTRA SLIM", pricePack: 2.50, priceCtn: 25.00, deal: "Pack" },
        { id: "op_45", category: "Filters", name: "VENTTI SUPER SLIM", pricePack: 2.50, priceCtn: 25.00, deal: "Pack" },
        { id: "op_46", category: "Filters", name: "VENTTI SLIM", pricePack: 2.50, priceCtn: 25.00, deal: "Pack" },
        { id: "op_47", category: "Filters", name: "VENTTI REGULAR", pricePack: 2.50, priceCtn: 25.00, deal: "Pack" },
        { id: "op_48", category: "Filters", name: "VENTTI MICRO SLIM", pricePack: 2.50, priceCtn: 25.00, deal: "Pack" },
        { id: "op_49", category: "Filters", name: "VENTTI XL MICRO SLIM", pricePack: 2.50, priceCtn: 25.00, deal: "Pack" },
        { id: "op_50", category: "Filters", name: "RANCH SUPER SLIM", pricePack: 2.50, priceCtn: 25.00, deal: "Pack" },
        { id: "op_51", category: "Filters", name: "RANCH NANO SLIM", pricePack: 2.50, priceCtn: 25.00, deal: "Pack" },
        { id: "op_52", category: "Filters", name: "RANCH MICRO SLIM", pricePack: 2.50, priceCtn: 25.00, deal: "Pack" },

        // Category: RAW Papers & Accessories
        { id: "op_53", category: "RAW Papers", name: "RAW CLASSIC 1/4", pricePack: 3.50, priceCtn: 35.00, deal: "Standard" },
        { id: "op_54", category: "RAW Papers", name: "RAW CLASSIC 1/4 + TIPS", pricePack: 4.50, priceCtn: 45.00, deal: "Combo" },
        { id: "op_55", category: "RAW Papers", name: "RAW CLASSIC KING", pricePack: 4.00, priceCtn: 40.00, deal: "King Size" },
        { id: "op_56", category: "RAW Papers", name: "RAW CLASSIC KING + TIPS", pricePack: 5.00, priceCtn: 50.00, deal: "King Combo" },
        { id: "op_57", category: "RAW Papers", name: "RAW CONE CLASSIC 6 PACKS", pricePack: 5.50, priceCtn: 55.00, deal: "Pre-rolled" },
        { id: "op_58", category: "RAW Papers", name: "RAW TIPS (50)", pricePack: 2.00, priceCtn: 20.00, deal: "Filter Tips" }
    ],

    // 4. SCALE PRICES SHEET
    scalePrices: [
        { id: "sc_1", category: "Digital Scales", model: "TUFF - Weigh", price: 80.00, stock: 15, note: "Heavy duty precision" },
        { id: "sc_2", category: "Digital Scales", model: "Mini Digital (WD 148)", price: 40.00, stock: 25, note: "Pocket size" },
        { id: "sc_3", category: "Digital Scales", model: "DJ - 100", price: 50.00, stock: 20, note: "0.01g precision" },
        { id: "sc_4", category: "Digital Scales", model: "MX - 100", price: 50.00, stock: 20, note: "Backlit screen" },
        { id: "sc_5", category: "Digital Scales", model: "LS - 100", price: 50.00, stock: 18, note: "Compact" },
        { id: "sc_6", category: "Digital Scales", model: "MV - 100", price: 60.00, stock: 15, note: "High accuracy" },
        { id: "sc_7", category: "Digital Scales", model: "Precision", price: 60.00, stock: 12, note: "Lab grade" },
        { id: "sc_8", category: "Digital Scales", model: "MMZ - 100", price: 70.00, stock: 10, note: "Micro scale" },
        { id: "sc_9", category: "Digital Scales", model: "MZ - 100", price: 80.00, stock: 10, note: "Heavy capacity" },
        { id: "sc_10", category: "Digital Scales", model: "SH - 100", price: 70.00, stock: 14, note: "Shielded lid" },
        { id: "sc_11", category: "Digital Scales", model: "MAR-100-BK (waterproof)", price: 100.00, stock: 8, note: "Waterproof & shockproof" },
        { id: "sc_12", category: "Digital Scales", model: "CL-300 (calculator)", price: 80.00, stock: 10, note: "Built-in calculator" },
        { id: "sc_13", category: "Digital Scales", model: "SS - 100", price: 80.00, stock: 12, note: "Stainless steel" },
        { id: "sc_14", category: "Digital Scales", model: "MTT - 200", price: 100.00, stock: 6, note: "Dual tare mode" },
        { id: "sc_15", category: "Digital Scales", model: "CJ - 20 / CK - 20", price: 150.00, stock: 5, note: "Jewelry scale" },
        { id: "sc_16", category: "Digital Scales", model: "RMM - 100 (RELOADER)", price: 150.00, stock: 4, note: "Reloader high grain" },
        { id: "sc_17", category: "Digital Scales", model: "CTP - 250", price: 230.00, stock: 3, note: "Pro series" },
        { id: "sc_18", category: "Digital Scales", model: "TW-200", price: 50.00, stock: 20, note: "Dual mode" },
        { id: "sc_19", category: "Digital Scales", model: "TSK1N (Calibrator)", price: 25.00, stock: 30, note: "Calibration weight" },

        // Trays Category
        { id: "sc_20", category: "Trays", model: "Small Tray", price: 22.50, stock: 50, note: "Range $25 - $20" },
        { id: "sc_21", category: "Trays", model: "Medium Tray", price: 32.50, stock: 40, note: "Range $35 - $30" },
        { id: "sc_22", category: "Trays", model: "Large Tray", price: 42.50, stock: 30, note: "Range $45 - $40" }
    ],

    // 5. CALVIN ORDER DESK
    calvinOrder: {
        orderId: "ORD-CAL-1001",
        customer: "Calvin Account",
        date: new Date().toISOString().split('T')[0],
        status: "Draft",
        items: [
            { id: "co_1", name: "Marl. Red Carton", qty: 2, unitPrice: 150, note: "Carton 10s" },
            { id: "co_2", name: "IGET Bar Pro Vape", qty: 5, unitPrice: 60, note: "Assorted flavors" },
            { id: "co_3", name: "RAW Classic 1/4 + Tips", qty: 10, unitPrice: 4.50, note: "Display box" }
        ]
    },

    // 6. BOSS ORDER DESK
    bossOrder: {
        orderId: "ORD-BOSS-2001",
        manager: "Management Bulk Order",
        date: new Date().toISOString().split('T')[0],
        status: "Pending Approval",
        items: [
            { id: "bo_1", name: "Manchester Red Cartons", qty: 20, unitPrice: 130, note: "Supplier wholesale rate" },
            { id: "bo_2", name: "UWELL Vape Units", qty: 40, unitPrice: 20, note: "Bulk deal 4@$100 conversion" },
            { id: "bo_3", name: "MAR-100-BK Waterproof Scales", qty: 5, unitPrice: 75, note: "Stock replenishment" }
        ]
    }
};

window.INITIAL_DATA = INITIAL_DATA;
