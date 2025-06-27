import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./Report.css";

const Report = () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const [data, setData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}`;
    });

    const handleExportExcel = () => {
    const rows = [];

    data.forEach(owner => {
        const monthStat = owner.monthlyStats.find(stat => stat.month === selectedMonth);
        if (monthStat) {
            rows.push({
                "Chủ xe": owner.ownerName,
                "Email": owner.ownerEmail,
                "SĐT": owner.ownerPhone,
                "Ngân hàng": `${owner.bankName} - ${owner.accountHolder} - ${owner.accountNumber}`,
                "Tổng doanh thu (vnđ)": monthStat.totalRevenue,
                "Số đơn đã thanh toán": monthStat.totalRentals
                    });
                }
            });

        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "DoanhThu");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const fileName = `BaoCao_DoanhThu_${selectedMonth}.xlsx`;

        const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(dataBlob, fileName);
    };

    const fetchRevenueData = async () => {
        try {
            const response = await axios.get(`${API_URL}/rental/by-month?month=${selectedMonth}`);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching revenue data:", error);
        }
    };

    useEffect(() => {
        fetchRevenueData();
    }, [selectedMonth]);

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    // Tính tổng doanh thu toàn hệ thống tháng đó
    const totalRevenueAllOwners = data.reduce((sum, owner) => {
        const monthStat = owner.monthlyStats.find(stat => stat.month === selectedMonth);
        return sum + (monthStat ? monthStat.totalRevenue : 0);
    }, 0);

    return (
        <div className="revenue-dashboard">
            <h2>Doanh thu theo chủ xe</h2>

            <div className="revenue-header">
                <div>
                    <label>Chọn tháng: </label>
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={handleMonthChange}
                    />
                </div>
                <button onClick={handleExportExcel}>Xuất Excel</button>


                <div className="revenue-total">
                    Tổng doanh thu: {totalRevenueAllOwners.toLocaleString()} vnđ
                </div>
            </div>

            <table className="revenue-table">
                <thead>
                    <tr>
                        <th>Chủ xe </th>
                        <th>Email</th>
                        <th>SĐT</th>
                        <th>Ngân hàng</th>
                        <th>Doanh thu</th>
                        <th>Số đơn đã thanh toán</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(owner => {
                        const monthStat = owner.monthlyStats.find(stat => stat.month === selectedMonth);
                        return (
                            <tr key={owner.ownerId}>
                                <td>{owner.ownerName}</td>
                                <td>{owner.ownerEmail}</td>
                                <td>{owner.ownerPhone}</td>
                                <td>{owner?.bankName}-{owner?.accountHolder}-{owner?.accountNumber}</td>
                                <td>{monthStat ? monthStat.totalRevenue.toLocaleString() : 0} vnđ</td>
                                <td>{monthStat ? monthStat.totalRentals : 0} đơn</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Report;
