<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VerificationEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $verificationCode;
    public $userName;

    /**
     * Create a new message instance.
     *
     * @param string $verificationCode
     * @param string $userName
     * @return void
     */
    public function __construct($verificationCode, $userName = 'Usuario')
    {
        $this->verificationCode = $verificationCode;
        $this->userName = $userName;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Verifica tu dirección de correo electrónico')
                    ->view('emails.verification');
    }
}
