import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./Report.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Report = () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const [data, setData] = useState([]);
    const [expandedOwnerId, setExpandedOwnerId] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}`;
        
    });


// Tạo danh sách 12 tháng gần nhất
    const getLast12Months = () => {
    const now = new Date();
    const months = [];

    for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
        months.push({ month: key, totalRevenue: 0 });
    }

    return months;
    };

    const monthlyRevenueData = getLast12Months().map(monthEntry => {
    const total = data.reduce((sum, owner) => {
        const stat = owner.monthlyStats.find(m => m.month === monthEntry.month);
        return sum + (stat ? stat.totalRevenue : 0);
    }, 0);

    return {
        ...monthEntry,
        totalRevenue: total,
    };
    });


    const handleExportExcel = () => {
    const rows = [];

    data?.forEach(owner => {
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
            console.log("Doanh thu", response.data)
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
            <div className="report-title">
                <h2 >Doanh thu theo tháng của chủ xe</h2>
            </div>

            <div className="revenue-header">
                <div>
                    <label>Chọn tháng: </label>
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={handleMonthChange}
                    />
                </div>
                <button className="action-hide" onClick={handleExportExcel}>Xuất Excel</button>


                <div className="revenue-total">
                    Tổng doanh thu: {totalRevenueAllOwners.toLocaleString()} vnđ
                </div>
            </div>

            <table className="rental-table">
                <thead>
                    <tr>
                        <th>Chủ xe </th>
                        <th>Email</th>
                        <th>SĐT</th>
                        <th>Ngân hàng</th>
                        <th>Doanh thu</th>
                        <th>Số đơn</th>
                        <th>Chi tiết mã đơn</th>
                    </tr>
                </thead>
        
                <tbody>
                    {data.map(owner => {
                        const monthStat = owner.monthlyStats.find(stat => stat.month === selectedMonth);
                        const isExpanded = expandedOwnerId === owner.ownerId;

                        return (
                        <React.Fragment key={owner.ownerId}>
                            <tr>
                            <td>{owner.ownerName}</td>
                            <td>{owner.ownerEmail}</td>
                            <td>{owner.ownerPhone}</td>
                            <td>{owner?.bankName || 'Vietcombank'}-{owner?.accountHolder||'Phan Ly'}-{owner?.accountNumber||'1020608758'}</td>
                            <td className="price">{monthStat ? monthStat.totalRevenue.toLocaleString() : 0} VNĐ</td>
                            <td>{monthStat ? monthStat.totalRentals : 0} đơn</td>
                            <td>
                                {monthStat?.rentals?.length > 0 && (
                                <button className="action-fix" onClick={() => setExpandedOwnerId(isExpanded ? null : owner.ownerId)}>
                                    {isExpanded ? "Ẩn mã đơn" : "Xem mã đơn"}
                                </button>
                                )}
                            </td>
                            </tr>

                            {isExpanded && monthStat?.rentals?.length > 0 && (
                            <tr>
                            <td colSpan="7" className="rental-details-cell">
                                <strong>Danh sách mã đơn:</strong>
                                <ul className="rental-details-list">
                                {monthStat.rentals.map((rental) => (
                                    <li key={rental.rentalId} className="rental-item">
                                    <div><strong>Mã đơn:</strong> <code>{rental.rentalId}</code></div>
                                    <div><strong>Tổng tiền:</strong> <span className="price">{rental.totalPrice.toLocaleString()} VNĐ</span></div>
                                    {/* <div><strong>Thời gian:</strong> {new Date(rental.startDate).toLocaleDateString('vi-VN')} {rental.startTime} - {new Date(rental.endDate).toLocaleDateString('vi-VN')} {rental.endTime}</div> */}
                                    </li>
                                ))}
                                </ul>
                            </td>
                            </tr>
                            )}
                        </React.Fragment>
                        );
                    })}
                    </tbody>

            </table>

            <h3>Biểu đồ doanh thu 12 tháng gần nhất</h3>
                <div style={{ width: "100%", height: 400 }}>
                <ResponsiveContainer>
                    <LineChart
                    data={monthlyRevenueData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${(value / 1e6).toFixed(1)}tr`} />
                    <Tooltip
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                            return (
                                <div style={{ background: 'white', padding: '10px', border: '1px solid #ccc' }}>
                                <p><strong>{label}</strong></p>
                                <p style={{ color: "#8884d8" }}>
                                    Tổng doanh thu: {payload[0].value.toLocaleString()} vnđ
                                </p>
                                </div>
                            );
                            }
                            return null;
                        }}
                        />

                    <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
                </div>

            </div>
        );
};

export default Report;
