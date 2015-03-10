<?php

use \Config;
use \DateTime;
use \Instrument;
use \User;

class UserService
{
    /**
     * To save constant Ajax calls, we neatly package up all the most relevant details of the user here and push them to
     * the front end application.
     *
     * @param  User   $User [description]
     * @return array
     */
    public function formatForJs(User $User)
    {
        return $User->toArray();
    }
}
