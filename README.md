# Speech_Processing_Final_Project

## Nguyên lý hoạt động: 
Tìm fingerprint của bài nhạc, Cũng như người có dấu vân tay để phân biệt, thì đoạn nhạc cũng có những đặc trưng để phân biệt với nhau. Ví dụ như nếu trích chọn đặc trưng theo miền thời gian, ta có thể lấy fingerprint của đoạn nhạc như Bao biên độ, Root mean square energy, Tỉ lệ điểm qua 0. Nếu trích chọn đặc trưng theo 

## Mô hình của bài tập lớn:
- Trích chọn đặc trưng theo miền tần số
        + Lấy Spectrogram của bản nhạc
        + Tìm những điểm đỉnh trong spectrogram có giá trị cường độ lớn nhất (cục bộ địa phương)
## Cài đặt mô hình
        + Lấy Spectrogram của bản nhạc (trong hàm fingerprint trong fingerprint.py): 
            * Sử dụng mlab.specgram của matplotlib
            * Parameter: Kích thước cửa sổ window_size(frame_size) = 4096
                         Sample_rate = 44100
                         Cửa sổ hàm: Hanning
                         Kích thước hop hop_size = window_size * 0.5
            * Chuyển cường độ theo thang loga 
        + Tìm những điểm đỉnh trong spectrogram có giá trị cường độ lớn nhất (cục bộ địa phương)
        + 
