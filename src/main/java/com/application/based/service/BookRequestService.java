package com.application.based.service;

import com.application.based.entity.User;
import com.application.based.model.BookRequestModel;
import com.application.based.model.RequestStatus;


public interface BookRequestService {
    String handleBookRequest(BookRequestModel model, User user);
    String updateRequestStatus(Long requestId, RequestStatus newStatus);
}
