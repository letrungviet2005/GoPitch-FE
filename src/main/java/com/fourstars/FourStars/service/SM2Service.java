package com.fourstars.FourStars.service;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class SM2Service {

    @Getter
    @Setter
    public static class SM2InputData {
        private int repetitions;
        private double easeFactor;
        private int interval;
        private int quality;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class SM2Result {
        private int newRepetitions;
        private double newEaseFactor;
        private int newInterval;
        private int newLevel;
        private Instant nextReviewDate;
    }

    public SM2Result calculate(SM2InputData data) {
        int repetitions = data.getRepetitions();
        double easeFactor = data.getEaseFactor();
        int interval = data.getInterval();
        int quality = data.getQuality();

        if (quality < 3) {
            // Nếu trả lời sai, reset số lần lặp lại và khoảng thời gian
            repetitions = 0;
            interval = 1;
        } else {
            // Nếu trả lời đúng
            repetitions++;
            if (repetitions == 1) {
                interval = 1;
            } else if (repetitions == 2) {
                interval = 6;
            } else {
                interval = (int) Math.round(interval * easeFactor);
            }
        }

        // Cập nhật hệ số dễ (Ease Factor)
        easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        if (easeFactor < 1.3) {
            easeFactor = 1.3;
        }

        // Tính toán cấp độ mới dựa trên khoảng thời gian ôn tập (interval)
        int newLevel = calculateLevel(interval);

        // Tính ngày ôn tập tiếp theo
        Instant nextReviewDate = Instant.now().plus(interval, ChronoUnit.DAYS);

        return new SM2Result(repetitions, easeFactor, interval, newLevel, nextReviewDate);
    }

    /**
     * Ánh xạ khoảng thời gian ôn tập (interval) sang cấp độ (level).
     * Bạn có thể điều chỉnh các ngưỡng này cho phù hợp với ứng dụng của mình.
     */
    private int calculateLevel(int intervalInDays) {
        if (intervalInDays <= 1) {
            return 1; // Mới học
        } else if (intervalInDays <= 7) {
            return 2; // Ghi nhớ tạm thời
        } else if (intervalInDays <= 21) {
            return 3; // Ghi nhớ khá tốt
        } else if (intervalInDays <= 60) {
            return 4; // Ghi nhớ dài hạn
        } else {
            return 5; // Đã thành thạo
        }
    }
}
