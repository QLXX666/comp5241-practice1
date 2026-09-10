# 获取当前时间
# 根据当前小时判断是上午、下午还是晚上
# 打印问候语 "Good morning/afternoon/evening, DU Guanjin!"
import datetime
hour = datetime.datetime.now().hour
if hour < 12:
    print("Good morning, DU Guanjin!")
elif hour < 18:
    print("Good afternoon, DU Guanjin!")
else:
    print("Good evening, DU Guanjin!")
