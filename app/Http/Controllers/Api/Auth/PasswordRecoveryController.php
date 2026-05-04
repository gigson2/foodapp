<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RequestPasswordRecoveryOtpRequest;
use App\Http\Requests\Auth\ResetPasswordWithOtpRequest;
use App\Services\PasswordRecoveryService;
use Illuminate\Http\JsonResponse;

class PasswordRecoveryController extends Controller
{
    public function __construct(
        protected PasswordRecoveryService $passwordRecoveryService,
    ) {
    }

    public function requestOtp(RequestPasswordRecoveryOtpRequest $request): JsonResponse
    {
        $this->passwordRecoveryService->requestOtp(
            $request->string('login')->toString(),
            $request->string('lookup')->toString(),
        );

        return response()->json([
            'message' => 'If we found an account with a recovery email, a reset code has been sent.',
        ]);
    }

    public function reset(ResetPasswordWithOtpRequest $request): JsonResponse
    {
        $this->passwordRecoveryService->resetPassword(
            $request->string('login')->toString(),
            $request->string('lookup')->toString(),
            $request->string('code')->toString(),
            $request->string('password')->toString(),
        );

        return response()->json([
            'message' => 'Password reset successful. Sign in with your new password.',
        ]);
    }
}
