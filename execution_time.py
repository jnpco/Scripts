import time


class ExecutionTime:
    def __init__(self):
        self.start_time = time.time()

    def get_duration(self):
        return time.time() - self.start_time


def test1():
    et = ExecutionTime()
    a = range(10000000)
    b = [i*2 for i in a]
    print('test1: ' + str(et.get_duration()))


def test2():
    et = ExecutionTime()
    a = range(10000000)
    b = []
    for i in a:
        b.append(i * 2)
    print('test2: ' + str(et.get_duration()))


test1()
test2()
