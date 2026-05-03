<?php

use Illuminate\Support\Facades\Route;

Route::get('/{path?}', fn () => view('app'))
    ->where('path', '^(?!api|sanctum|storage).*$')
    ->name('spa');
