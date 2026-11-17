# Từ RTL đến netlist

## Mục tiêu

Theo dõi RTL được chuyển thành các cell và dây nối. Synthesis đọc cú pháp, xây biểu diễn trung gian, chuyển process thành logic rồi tối ưu. Với Yosys, write_json xuất netlist có thể dùng để vẽ sơ đồ.

## Đọc kết quả

Tên cell cho biết loại chức năng, ports cho biết kết nối và bit IDs nối các tín hiệu. Logic không ảnh hưởng đầu ra có thể bị loại bỏ. Hằng số có thể làm cả nhánh biến mất. Vì vậy số dòng RTL không đo được diện tích.

Generic synthesis tạo cell tổng quát. Technology mapping chọn cell từ thư viện đích. Muốn so sánh hai thiết kế, giữ cùng top module, lệnh tổng hợp và mục tiêu. Kiểm tra lại chức năng sau thay đổi trước khi diễn giải chênh lệch số cell.

## Thử trong playground

Đọc tên cổng và độ rộng trước khi chạy. Mở ví dụ tương ứng, sửa một biểu thức và chạy lại testbench. Quan sát cả đầu ra lẫn thông báo lỗi.

```verilog
module top(input a, b, output y);
  assign y = ~(a & b);
endmodule
```
