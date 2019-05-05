from flask import flash, redirect, g
import functools

def auth_check(func):
    @functools.wraps(func)
    def wrapper_auth_check(*args, **kwargs):
        if not g.user:
            flash("Access unauthorized.", "danger")
            return redirect("/")
        
        return func(*args, **kwargs)

    return wrapper_auth_check