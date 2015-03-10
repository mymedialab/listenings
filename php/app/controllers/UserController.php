<?php
use \App;
use \Auth;
use \DateTime;
use \Hash;
use \Input;
use \Response;
use \Validator;
use \User;

class UserController extends BaseController
{
    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store()
    {
        $vars = [
            "name"     => "required",
            "username" => "required",
            "email"    => "required|email",
            "password" => "required"
        ];

        $V = Validator::make(Input::all(), $vars);

        if ($V->fails()) {
            return Response::json(['success' => false, 'errors' => $V->errors()], 400);
        }

        $User = User::create([
            "name"     => Input::get("name"),
            "username" => Input::get("username"),
            "email"    => Input::get("email"),
            "password" => Hash::make(Input::get("password"))
        ]);

        $UserService = App::make('UserService');
        return Response::json(['success' => true, 'user' => $UserService->formatForJs($User)], 200);
    }

    public function available()
    {
        if (!Input::has('username')) {
            return Response::json([
                'success' => false,
                'errors' => ["username" => ["Missing required field"]]
            ], 400);
        }

        $available = !User::findBy('username', Input::get('username'))->count();

        // we could determine availability with HTTP response codes like a proper little RESTful provider, but that always
        // leads to lazy JS, where server errors === no username available. Normally this would be the opposite.
        return Response::json(['success' => true, 'available' => $available], 200);
    }

    public function changePassword()
    {
        $User = Auth::user();
        $existing = Input::get('existing_password');
        if (!$existing) {
            return Response::json(['message' => 'Must supply existing password to change details.'], 400);
        }
        if (!Auth::validate(['id' => $User->id, 'password' => $existing])) {
            return Response::json(['message' => 'Existing password incorrect.'], 401);
        }

        $new = Input::get('new_password');
        if (!$new) {
            return Response::json(['message' => 'Must supply new password to change details.'], 400);
        }

        $User->password = Hash::make($new);
        $User->save();

        return Response::json(['message' => 'Password changed.'], 200);
    }

    public function update()
    {
        // don't really need the first two, but it helps a lot as living documentation.
        $vars = [
            "name"     => "",
            "username" => "",
            "email"    => "email"
        ];

        $V = Validator::make(Input::all(), $vars);

        if ($V->fails()) {
            return Response::json(['errors' => $V->errors()], 400);
        }

        $User = Auth::user();

        if (Input::has('username')) {
            $Collision = User::findBy('username', Input::get('username'));
            if ($Collision->count() && $Collision->first()->id !== $User->id) {
                return Response::json(['message' => 'Username already in use'], 409);
            }
        }

        foreach (['name', 'username', 'email'] as $key) {
            if (Input::has($key)) {
                $User->$key = Input::get($key);
            }
        }

        $User->save();

        $UserService = App::make('UserService');
        return Response::json(['success' => true, 'user' => $UserService->formatForJs($User)], 200);
    }
}
