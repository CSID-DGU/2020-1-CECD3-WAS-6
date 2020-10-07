def maxunit(x,y):
	max = 0
	min = 0
	if(x > y):
		max = x
		min = y
	else:
		max = y
		min = x
	for i in range(1,10):
		max = max + min	#bug

	return max+min