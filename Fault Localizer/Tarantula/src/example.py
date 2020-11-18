def example(x, y):
    ret = 0
    if(x>y):
        x = x - 2   #bug x = x+2
        ret = ret+1
    else:   y = y+2
    if(x < y+6):
        ret = ret+2
    return ret