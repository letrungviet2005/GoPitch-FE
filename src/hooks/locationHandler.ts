import Cookies from 'js-cookie';

interface UserCoords {
    lat: number;
    lng: number;
}

const LOCATION_COOKIE_KEY = 'user_coords';
const COOKIE_EXPIRE_DAYS = 1; // Cookie sẽ hết hạn sau 1 ngày

export const handleAndStoreLocation = (): void => {
    if (!navigator.geolocation) {
        console.log("Trình duyệt không hỗ trợ định vị.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            const coords: UserCoords = { lat: latitude, lng: longitude };

            // Lưu vào cookie dưới dạng chuỗi JSON
            // Secure: true đảm bảo chỉ gửi qua HTTPS, SameSite: Lạnh lùng bảo mật
            Cookies.set(LOCATION_COOKIE_KEY, JSON.stringify(coords), { 
                expires: COOKIE_EXPIRE_DAYS,
                path: '/' 
            });

            console.log("Đã lưu tọa độ vào Cookie:", coords);
        },
        (error) => {
            // Nếu người dùng từ chối (User denied Geolocation)
            // hoặc có lỗi khác, chúng ta không làm gì cả như ông yêu cầu
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    console.log("Người dùng từ chối cấp quyền vị trí.");
                    break;
                default:
                    console.log("Lỗi định vị:", error.message);
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
};

// Hàm bổ trợ để ông lấy tọa độ ra sử dụng ở chỗ khác
export const getStoredLocation = (): UserCoords | null => {
    const savedLocation = Cookies.get(LOCATION_COOKIE_KEY);
    if (savedLocation) {
        try {
            return JSON.parse(savedLocation);
        } catch (e) {
            return null;
        }
    }
    return null;
};