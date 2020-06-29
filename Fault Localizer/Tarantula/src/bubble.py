def bubble(input):
    for i in range(len(input)-1):
        for j in range(len(input)):
            if input[i] > input[j]:
                temp = input[i]
                input[i] = input[j]
                input[j] = temp
    return input