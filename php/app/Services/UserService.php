<?php

use \Config as Config;
use \DateTime as DateTime;
use \Instrument as Instrument;
use \User as User;

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
