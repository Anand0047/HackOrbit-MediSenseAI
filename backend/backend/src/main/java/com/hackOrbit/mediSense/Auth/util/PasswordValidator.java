package com.hackOrbit.mediSense.Auth.util;

import java.util.regex.Pattern;

public class PasswordValidator {

    private static final Pattern UPPERCASE = Pattern.compile("[A-Z]");
    private static final Pattern LOWERCASE = Pattern.compile("[a-z]");
    private static final Pattern DIGIT = Pattern.compile("\\d");
    private static final Pattern SPECIAL = Pattern.compile("[^a-zA-Z0-9]");
    private static final int MIN_LENGTH = 8;

    public static String validate(String password, String confirmPassword){

        if(password == null || confirmPassword == null){
            return "Password and Confirm Password cannot be null";
        }

        if(!password.equals(confirmPassword)){
            return "Password do not match";
        }

        if(password.length() < MIN_LENGTH){
            return "Password must be at least 8 characters long";
        }

        if(!UPPERCASE.matcher(password).find()){
            return "Password must contain at least one uppercase letter";
        }

        if(!LOWERCASE.matcher(password).find()){
            return "Password must contain at least one lowercase letter";
        }

        if(!DIGIT.matcher(password).find()){
            return "Password must contain at least one digit";
        }

        if(!SPECIAL.matcher(password).find()){
            return "Password must contain at least one special character";
        }

        return null;
    }
}
