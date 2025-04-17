package com.application.based.service;

import com.application.based.entity.User;
import com.application.based.model.BookRequestModel;
import com.application.based.model.RequestStatus;


public interface BookRequestService {
    String handleBookRequest(BookRequestModel model, User user);
    String updateRequestStatus(Long requestId, RequestStatus newStatus);

    //    public List<BookRequest> getUserRequests(User user, int limit) {
    //        Page<BookRequest> page = bookRequestRepository.findByRequesterId(
    //                user.getId(),
    //                PageRequest.of(0, limit, Sort.by("createdAt").descending())
    //        );
    //        return page.getContent();
    //    }
//    Page<BookRequest> getUserRequests (User user, Pageable pageable);

//    List<BookRequest> getUserRequests (User user, int limit);
}
