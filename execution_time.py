import time


class ExecutionTime:
    def __init__(self):
        self.cur_time = 0

    def start(self):
        self.cur_time = time.time()

    def stop(self):
        cur_time = self.cur_time
        self.cur_time = 0
        return time.time() - cur_time

    def get_duration(self):
        return time.time() - self.cur_time


ET = ExecutionTime()


def test1():
    ET.start()
    a = range(10000000)
    b = [i*2 for i in a]
    print('test1: ' + str(ET.stop()))


def test2():
    ET.start()
    a = range(10000000)
    b = []
    for i in a:
        b.append(i * 2)
    print('test2: ' + str(ET.stop()))


test1()
test2()
