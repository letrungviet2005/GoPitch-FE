package com.fourstars.FourStars.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fourstars.FourStars.domain.Plan;
import com.fourstars.FourStars.domain.Subscription;
import com.fourstars.FourStars.domain.User;
import com.fourstars.FourStars.domain.request.subscription.SubscriptionRequestDTO;
import com.fourstars.FourStars.domain.response.ResultPaginationDTO;
import com.fourstars.FourStars.domain.response.subscription.SubscriptionResponseDTO;
import com.fourstars.FourStars.repository.PlanRepository;
import com.fourstars.FourStars.repository.SubscriptionRepository;
import com.fourstars.FourStars.repository.UserRepository;
import com.fourstars.FourStars.util.SecurityUtil;
import com.fourstars.FourStars.util.constant.PaymentStatus;
import com.fourstars.FourStars.util.error.BadRequestException;
import com.fourstars.FourStars.util.error.DuplicateResourceException;
import com.fourstars.FourStars.util.error.ResourceNotFoundException;

@Service
public class SubscriptionService {
    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final PlanRepository planRepository;

    public SubscriptionService(SubscriptionRepository subscriptionRepository, UserRepository userRepository,
            PlanRepository planRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
        this.planRepository = planRepository;
    }

    private SubscriptionResponseDTO convertToSubscriptionResponseDTO(Subscription subscription) {
        if (subscription == null)
            return null;
        SubscriptionResponseDTO dto = new SubscriptionResponseDTO();
        dto.setId(subscription.getId());

        if (subscription.getUser() != null) {
            SubscriptionResponseDTO.UserInfoDTO userInfo = new SubscriptionResponseDTO.UserInfoDTO();
            userInfo.setId(subscription.getUser().getId());
            userInfo.setName(subscription.getUser().getName());
            userInfo.setEmail(subscription.getUser().getEmail());
            dto.setUser(userInfo);
        }

        if (subscription.getPlan() != null) {
            SubscriptionResponseDTO.PlanInfoDTO planInfo = new SubscriptionResponseDTO.PlanInfoDTO();
            planInfo.setId(subscription.getPlan().getId());
            planInfo.setName(subscription.getPlan().getName());
            planInfo.setPrice(subscription.getPlan().getPrice());
            planInfo.setDurationInDays(subscription.getPlan().getDurationInDays());
            dto.setPlan(planInfo);
        }

        dto.setStartDate(subscription.getStartDate());
        dto.setEndDate(subscription.getEndDate());
        dto.setActive(subscription.isActive());
        dto.setPaymentStatus(subscription.getPaymentStatus());
        dto.setTransactionId(subscription.getTransactionId());
        dto.setCreatedAt(subscription.getCreatedAt());
        dto.setUpdatedAt(subscription.getUpdatedAt());
        return dto;
    }

    @Transactional
    public SubscriptionResponseDTO create(SubscriptionRequestDTO request) throws DuplicateResourceException {
        String currentUserEmail = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new ResourceNotFoundException("User not authenticated to create a subscription."));

        User user = this.userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Authenticated user not found in database: " + currentUserEmail));

        Plan plan = this.planRepository.findById(request.getPlanId())
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found with id: " + request.getPlanId()));

        if (!plan.isActive())
            throw new BadRequestException("Plan is not active: " + request.getPlanId());

        if (subscriptionRepository.findByUserIdAndPlanIdAndActiveTrue(user.getId(), plan.getId()).isPresent()) {
            throw new DuplicateResourceException(
                    "User already has an active subscription for plan: " + plan.getName());
        }

        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setPlan(plan);

        Instant startDate = Instant.now();
        subscription.setStartDate(startDate);
        if (plan.getDurationInDays() != null) {
            subscription.setEndDate(startDate.plus(plan.getDurationInDays(), ChronoUnit.DAYS));
        } else {
            throw new BadRequestException("Plan duration is not configured correctly.");
        }

        subscription.setPaymentStatus(PaymentStatus.PENDING);
        subscription.setActive(false);

        Subscription savedSubscription = subscriptionRepository.save(subscription);
        return convertToSubscriptionResponseDTO(savedSubscription);
    }

    @Transactional
    public SubscriptionResponseDTO confirmSubscriptionPayment(long subscriptionId, String transactionId,
            PaymentStatus status) throws ResourceNotFoundException {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + subscriptionId));

        subscription.setTransactionId(transactionId);
        subscription.setPaymentStatus(status);
        if (status == PaymentStatus.PAID) {
            subscription.setActive(true);
        } else {
            subscription.setActive(false);
        }
        Subscription updatedSubscription = subscriptionRepository.save(subscription);
        return convertToSubscriptionResponseDTO(updatedSubscription);
    }

    @Transactional(readOnly = true)
    public SubscriptionResponseDTO fetchSubscriptionById(long id) throws ResourceNotFoundException {
        String currentUserEmail = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new ResourceNotFoundException("User not authenticated."));

        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + id));

        // Chỉ admin hoặc chủ sở hữu subscription mới được xem
        if (!subscription.getUser().getEmail().equals(currentUserEmail)
                && userRepository.findByEmail(currentUserEmail).get().getRole().getName() != "ADMIN") {
            throw new ResourceNotFoundException("You do not have permission to view this subscription.");
        }
        return convertToSubscriptionResponseDTO(subscription);
    }

    @Transactional(readOnly = true)
    public ResultPaginationDTO<SubscriptionResponseDTO> fetchUserSubscriptions(Pageable pageable)
            throws ResourceNotFoundException {
        String currentUserEmail = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new ResourceNotFoundException("User not authenticated."));
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found."));

        Page<Subscription> pageSubscription = subscriptionRepository.findByUserId(user.getId(), pageable);
        List<SubscriptionResponseDTO> subscriptionDTOs = pageSubscription.getContent().stream()
                .map(this::convertToSubscriptionResponseDTO)
                .collect(Collectors.toList());

        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta(
                pageable.getPageNumber() + 1,
                pageable.getPageSize(),
                pageSubscription.getTotalPages(),
                pageSubscription.getTotalElements());
        return new ResultPaginationDTO<>(meta, subscriptionDTOs);
    }

    @Transactional(readOnly = true)
    public ResultPaginationDTO<SubscriptionResponseDTO> fetchAllSubscriptionsAsAdmin(Pageable pageable) {
        Page<Subscription> pageSubscription = subscriptionRepository.findAll(pageable);
        List<SubscriptionResponseDTO> subscriptionDTOs = pageSubscription.getContent().stream()
                .map(this::convertToSubscriptionResponseDTO)
                .collect(Collectors.toList());

        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta(
                pageable.getPageNumber() + 1,
                pageable.getPageSize(),
                pageSubscription.getTotalPages(),
                pageSubscription.getTotalElements());
        return new ResultPaginationDTO<>(meta, subscriptionDTOs);
    }

}
