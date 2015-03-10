<?php

use \Input;
use \Hash;
use \Lang;
use \Password;
use \Response;

class RemindersController extends Controller
{
    /**
     * Handle a POST request to remind a user of their password.
     *
     * @return Response
     */
    public function postRemind()
    {
        $response = Password::remind(Input::only('email'), function($message) {
            $message->subject('Password Reminder');
        });

        switch ($response) {
            case Password::INVALID_USER:
                return Response::json(array('status' => Lang::get($response)), 404);

            case Password::REMINDER_SENT:
                return Response::json(array('status' => Lang::get($response)), 200);
        }
    }

    /**
     * Handle a POST request to reset a user's password.
     *
     * @return Response
     */
    public function postReset()
    {
        $credentials = Input::only(
            'email', 'password', 'password_confirmation', 'token'
        );

        $response = Password::reset($credentials, function($user, $password) {
            $user->password = Hash::make($password);
            $user->save();
        });

        switch ($response) {
            case Password::INVALID_PASSWORD:
            case Password::INVALID_TOKEN:
            case Password::INVALID_USER:
                return Response::json(array('status' => Lang::get($response)), 400);

            case Password::PASSWORD_RESET:
                return Response::json(array('status' => Lang::get($response)), 200);
        }
    }
}
