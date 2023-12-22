from time import sleep
from util import detect_lm68
import os
import shutil
from createDetection_5point import initalizeCreateDetection_5point

def initalizeCreateDetection(inputPath):
    #copy to test directory
    folder_name = "test_directory"

    if os.path.exists(folder_name):
        shutil.rmtree(folder_name)

    os.makedirs(folder_name)

    detection_folder = os.path.join(folder_name, "detections")
    os.makedirs(detection_folder)

    shutil.copy(inputPath, os.path.join(folder_name, os.path.basename(inputPath)))

    initalizeCreateDetection_5point(inputPath)


    paste_dir = str(os.path.basename(inputPath)).replace(".jpg", ".txt").replace(".png", ".txt").replace(".jpeg", ".txt")

    os.rename("./detection.txt", paste_dir)

    shutil.move(paste_dir, detection_folder)

    #call the process function
    processDetection(os.path.join(folder_name))

    copy_file = os.path.join(folder_name, "landmarks")
    copy_file_f = os.path.join(copy_file, paste_dir)
    copy_file_s = os.path.join(copy_file, "detection.txt")
    os.rename(copy_file_f, copy_file_s)

    shutil.copy(copy_file_s, "./")

    shutil.rmtree(os.path.join(folder_name))


def processDetection(inputDirectory):
    lm_sess,img_224,output_lm = detect_lm68.load_lm_graph("./checkpoints/lm_model/68lm_detector.pb")

    detect_lm68.detect_68p(inputDirectory, lm_sess, img_224, output_lm)