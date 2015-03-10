<?php

use \App;
use \Auth;
use \Config;
use \Input;
use \Response;
use \Redirect;
use \Validator;
use \View;
use \User;

class AuthController extends Controller
{
    protected $loginStatus;

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function login()
    {
        $response = $this->doLogin();
        return Response::json($response, $this->loginStatus);
    }

    public function logout() {
        Auth::logout();
        return Response::json(['success' => true], 200);
    }

    public function session() {
        $User = Auth::user();
        if (is_null($User)) {
            return Response::json(['success' => false], 401);
        } else {
            $Service = App::make('UserService');
            return Response::json(['success' => true, 'user' => $Service->formatForJs($User)], 200);
        }
    }

    protected function doLogin()
    {
        $require = ['username' => 'required', 'password' => 'required'];
        $Validator = Validator::make(Input::all(), $require);

        $userdata_name = [
            'username' => Input::get('username'),
            'password' => Input::get('password')
        ];
        $userdata_email = [
            'email'    => Input::get('username'),
            'password' => Input::get('password')
        ];

        if ($Validator->fails()) {
            $this->loginStatus = 400;
            return ['success' => false, 'errors' => $Validator->errors()];
        }

        if (Auth::attempt($userdata_name) || Auth::attempt($userdata_email)) {
            $this->loginStatus = 200;
            return ['success' => true, 'user' => Auth::user()];
        } else {
            $this->loginStatus = 401;
            return [
                'success' => false,
                'errors' => [
                    'form' => ['Authentication failed.']
                ]
            ];
        }
    }
}
