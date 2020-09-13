def findsecond(a,b,c,d):
    temp = 0
    if(a <= b):
        max = b
        min = a
    else:
        max = a
        min = b
    if(c > max):
        temp = max
        max = c
    elif(c < min):
        min = c		#bug    temp = min
    else:
        temp = b	#bug    temp = c
    if(d < max and d > temp):
        return d
    elif(d > max):
        return max
    else:
        return temp