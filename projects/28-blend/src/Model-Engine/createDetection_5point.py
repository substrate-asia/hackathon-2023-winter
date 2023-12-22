import cv2
from mtcnn import MTCNN

def initalizeCreateDetection_5point(inputDirectory):

    # Load the image in RGB format
    img = cv2.cvtColor(cv2.imread(inputDirectory), cv2.COLOR_BGR2RGB)

    # Initialize the MTCNN detector
    detector = MTCNN()

    # Number of passes
    num_passes = 5
    all_keypoints = []

    # Run the detector multiple times
    for _ in range(num_passes):
        # Detect faces in the image
        faces = detector.detect_faces(img)

        # Collect the keypoints for each face
        face_keypoints = []
        for face in faces:
            keypoints = face['keypoints']
            face_keypoints.append(keypoints)
        
        all_keypoints.append(face_keypoints)

    # Compute the average keypoints
    average_keypoints = {}
    for keypoints_list in all_keypoints:
        for keypoints in keypoints_list:
            for keypoint, (x, y) in keypoints.items():
                if keypoint not in average_keypoints:
                    average_keypoints[keypoint] = [x, y]
                else:
                    average_keypoints[keypoint][0] += x
                    average_keypoints[keypoint][1] += y

    # Calculate the average
    for keypoint, (x, y) in average_keypoints.items():
        average_keypoints[keypoint][0] /= num_passes
        average_keypoints[keypoint][1] /= num_passes

    with open("detection.txt", 'w') as f:
        for keypoint, (x, y) in average_keypoints.items():
            f.write(f"{x:.2f} {y:.2f}\n")