def gcd(a,b):
    if(a<0):
        a = -a
    if(b<0):
        b = -b
    if(a==0):
        return b
    if(b==0):
        return a
    while(b != 0):
        if(a>b):
            a = a - 1   #bug a = a - b
        else:
            b = b - a
    return a