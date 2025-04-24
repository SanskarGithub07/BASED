package com.application.based.service;

import com.application.based.entity.BookRequest;
import com.application.based.entity.User;
import com.application.based.model.BookRequestModel;
import com.application.based.model.RequestStatus;
import org.springframework.data.domain.Page;


public interface BookRequestService {
    String handleBookRequest(BookRequestModel model, User user);
    String updateRequestStatus(Long requestId, RequestStatus newStatus);

    Page<BookRequest> getRecentUserRequests(User user, int limit);
}
