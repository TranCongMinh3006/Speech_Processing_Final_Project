# Speech_Processing_Final_Project - Nhóm 2

# Phân công công việc
+ Hoàng Phương Linh - Tìm hiểu và viết báo cáo nguyên lý hoạt động, mô hình lý thuyết, cài đặt, đánh giá
+ Trần Công Minh - Thực nghiệm, chạy mô hình, quay video, kết hợp frontend và backend
+ Cao Cẩm Nhung - Thu thập và xử lý dữ liệu
+ Nguyễn Mạnh Tuấn - Viết frontend, kết hợp frontend và backend

# Mô tả chung
## Chức năng của web
Phân biệt bài hát với 2 đầu vào có thể là:
- Ghi âm trực tiếp trên web
- Tải file lên web

Mô hình sẽ trả về:
- Tên bài hát đó nếu bài hát đó có trong cơ sở dữ liệu
- Tên bài hát tương tự nếu bài hát đó không có trong cơ sở dữ liệu

Sau đó Web sẽ trả thẳng video cũng như đường link đến youtube của bài hát đó

## Dữ liệu
- Kho dữ liệu gồm 150 bài hát tiếng Việt lưu dưới định dạng mp3, được trích xuất fingerprint và hash lại để so khớp.
- 
## Phương pháp
Nguyên lý cơ bản là tìm fingerprint của bài nhạc để phân biệt các bản nhạc. Cũng như người có dấu vân tay để phân biệt, thì đoạn nhạc cũng có những đặc trưng để phân biệt với nhau.

Ví dụ như:

+ Nếu trích chọn đặc trưng theo miền thời gian, ta có thể lấy fingerprint của đoạn nhạc như Bao biên độ, Root mean square energy, Tỉ lệ điểm qua 0. 

+ Nếu trích chọn đặc trưng theo miền tần số, ta có thể khai thác các điểm formant (“peaks” in amplitude), là các điểm cực đại cục bộ, có tần số áp đảo (dominant), mang đặc tính của âm thanh.

### Mô hình của bài tập lớn
  - Trích chọn đặc trưng theo miền tần số
    + Lấy Spectrogram của bản nhạc
    + Tìm những điểm đỉnh formant trong spectrogram có giá trị cường độ lớn nhất (cực đại cục bộ địa phương)
    + 
### Cài đặt mô hình
        + Lấy Spectrogram của bản nhạc (trong hàm fingerprint trong fingerprint.py): 
            * Sử dụng mlab.specgram của matplotlib
            * Parameter: Kích thước cửa sổ window_size(frame_size) = 4096
                         Sample_rate = 44100
                         Cửa sổ hàm: Hanning
                         Kích thước hop hop_size = window_size * 0.5
            * Chuyển cường độ theo thang loga 
        + Tìm những điểm đỉnh trong spectrogram có giá trị cường độ lớn nhất (cục bộ địa phương)
        + 
# Thực nghiệm, đánh giá

# Hướng dẫn sử dụng Web
