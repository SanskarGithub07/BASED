package com.application.based.service;

import com.application.based.entity.User;
import com.application.based.model.BookRequestModel;

public interface BookRequestService {
    String handleBookRequest(BookRequestModel model, User user);
}
