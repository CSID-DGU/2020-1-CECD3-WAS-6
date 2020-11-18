def gcd(a,b):
    if(a<0):
        a = -a
    if(b<0):
        b = -b
    if(a==0):
        return b
    if(b==0):
            b = b - a
    return a