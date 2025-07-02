# Hệ thống Thông báo (Toast Notifications)

## Tổng quan
Hệ thống thông báo sử dụng `react-toastify` để hiển thị các thông báo thành công, lỗi, cảnh báo và thông tin trong ứng dụng.

## Cài đặt
```bash
npm install react-toastify
```

## Cách sử dụng

### 1. Import utility functions
```javascript
import { 
  showSuccess, 
  showError, 
  showWarning, 
  showInfo, 
  showLoading, 
  updateLoading,
  showCustomToast 
} from '../utils/toast';
```

### 2. Các loại thông báo cơ bản

#### Success Notification
```javascript
showSuccess('Thao tác thành công!');
```

#### Error Notification
```javascript
showError('Có lỗi xảy ra!');
```

#### Warning Notification
```javascript
showWarning('Cảnh báo!');
```

#### Info Notification
```javascript
showInfo('Thông tin mới');
```

### 3. Loading Notification
```javascript
// Hiển thị loading
const loadingToast = showLoading('Đang xử lý...');

// Cập nhật loading thành success
updateLoading(loadingToast, 'Thành công!', 'success');

// Cập nhật loading thành error
updateLoading(loadingToast, 'Lỗi!', 'error');
```

### 4. Custom Toast với Icon
```javascript
showCustomToast(
  'success',           // type: 'success' | 'error' | 'warning' | 'info'
  'Thông báo chi tiết', // message
  'Tiêu đề tùy chỉnh'   // title (optional)
);
```

## Ví dụ thực tế

### Trong EmployerManagement
```javascript
const handleAction = async (employerId, action) => {
  const loadingToast = showLoading(`Đang ${action === 'approve' ? 'duyệt' : 'từ chối'} employer...`);
  
  try {
    const response = await axios.post('/api/admin/employer-management', { 
      employerId, 
      action 
    });
    
    // Cập nhật UI
    setEmployers(prevEmployers => 
      prevEmployers.map(emp => 
        emp.id === employerId 
          ? { ...emp, status: response.data.status }
          : emp
      )
    );
    
    // Hiển thị thông báo thành công
    updateLoading(loadingToast, response.data.message, 'success');
    showCustomToast(
      'success', 
      response.data.message, 
      action === 'approve' ? 'Đã duyệt thành công!' : 'Đã từ chối thành công!'
    );
  } catch (err) {
    // Hiển thị thông báo lỗi
    updateLoading(loadingToast, 'Lỗi khi cập nhật trạng thái: ' + err.message, 'error');
  }
};
```

### Trong Dashboard
```javascript
const handleAddCategory = async (e) => {
  e.preventDefault();
  if (!newCategory.trim()) return;
  
  const loadingToast = showLoading('Đang thêm danh mục...');
  
  try {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategory }),
    });
    
    if (res.ok) {
      setNewCategory('');
      fetchCategories();
      updateLoading(loadingToast, 'Thêm danh mục thành công!', 'success');
    } else {
      updateLoading(loadingToast, 'Thêm danh mục thất bại!', 'error');
    }
  } catch (error) {
    updateLoading(loadingToast, 'Lỗi kết nối!', 'error');
  }
};
```

## Cấu hình

### ToastContainer Configuration
```javascript
// Trong ToastContainer.jsx
<ReactToastContainer
  position="top-right"        // Vị trí hiển thị
  autoClose={3000}           // Tự động đóng sau 3 giây
  hideProgressBar={false}    // Hiển thị thanh tiến trình
  newestOnTop={false}        // Thông báo mới ở dưới
  closeOnClick               // Đóng khi click
  rtl={false}                // Không phải RTL
  pauseOnFocusLoss           // Tạm dừng khi mất focus
  draggable                  // Có thể kéo
  pauseOnHover               // Tạm dừng khi hover
  theme="light"              // Theme sáng
/>
```

### Custom Configuration
```javascript
// Cấu hình tùy chỉnh cho từng thông báo
showSuccess('Thành công!', {
  autoClose: 5000,           // Đóng sau 5 giây
  position: "top-center",    // Vị trí khác
  hideProgressBar: true      // Ẩn thanh tiến trình
});
```

## Các loại thông báo

### 1. Success (Thành công)
- Màu: Xanh lá
- Icon: ✓
- Sử dụng khi: Thao tác thành công

### 2. Error (Lỗi)
- Màu: Đỏ
- Icon: ✗
- Sử dụng khi: Có lỗi xảy ra

### 3. Warning (Cảnh báo)
- Màu: Vàng
- Icon: ⚠
- Sử dụng khi: Cần cảnh báo

### 4. Info (Thông tin)
- Màu: Xanh dương
- Icon: ℹ
- Sử dụng khi: Hiển thị thông tin

### 5. Loading (Đang tải)
- Màu: Xám
- Icon: Spinner
- Sử dụng khi: Đang xử lý

## Best Practices

1. **Sử dụng loading cho các thao tác bất đồng bộ**
2. **Hiển thị thông báo lỗi chi tiết để debug**
3. **Sử dụng custom toast cho các thông báo quan trọng**
4. **Không spam thông báo - chỉ hiển thị khi cần thiết**
5. **Sử dụng autoClose phù hợp với loại thông báo**

## Troubleshooting

### Thông báo không hiển thị
- Kiểm tra ToastContainer đã được thêm vào App.jsx
- Kiểm tra import react-toastify CSS
- Kiểm tra console có lỗi JavaScript không

### Thông báo hiển thị sai vị trí
- Kiểm tra cấu hình position trong ToastContainer
- Kiểm tra CSS có bị conflict không

### Thông báo không tự đóng
- Kiểm tra cấu hình autoClose
- Kiểm tra có lỗi JavaScript ngăn cản không 