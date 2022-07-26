#!/usr/bin/env python3

import cv2
import depthai as dai
import numpy as np
import json
import libraries.config as config
from libraries.haws import *

CALIBRATED = True
BACKGROUND = 63
SHELF = 74

# Closer-in minimum depth, disparity range is doubled (from 95 to 190):
extended_disparity = False
# Better accuracy for longer distance, fractional disparity 32-levels:
subpixel = False
# Better handling for occlusions:
lr_check = True

# Create pipeline
pipeline = dai.Pipeline()

# Define sources and outputs
monoLeft = pipeline.create(dai.node.MonoCamera)
monoRight = pipeline.create(dai.node.MonoCamera)
depth = pipeline.create(dai.node.StereoDepth)
xout = pipeline.create(dai.node.XLinkOut)

xout.setStreamName("disparity")

# Properties
monoLeft.setResolution(dai.MonoCameraProperties.SensorResolution.THE_400_P)
monoLeft.setBoardSocket(dai.CameraBoardSocket.LEFT)
monoRight.setResolution(dai.MonoCameraProperties.SensorResolution.THE_400_P)
monoRight.setBoardSocket(dai.CameraBoardSocket.RIGHT)

# Create a node that will produce the depth map (using disparity output as it's easier to visualize depth this way)
depth.setDefaultProfilePreset(dai.node.StereoDepth.PresetMode.HIGH_DENSITY)
# Options: MEDIAN_OFF, KERNEL_3x3, KERNEL_5x5, KERNEL_7x7 (default)
depth.initialConfig.setMedianFilter(dai.MedianFilter.KERNEL_7x7)
depth.setLeftRightCheck(lr_check)
depth.setExtendedDisparity(extended_disparity)
depth.setSubpixel(subpixel)

# Linking
monoLeft.out.link(depth.left)
monoRight.out.link(depth.right)
depth.disparity.link(xout.input)



max_value = 255
max_type = 4
max_binary_value = 255
trackbar_type = 'Type: \n 0: Binary \n 1: Binary Inverted \n 2: Truncate \n 3: To Zero \n 4: To Zero Inverted'
trackbar_value = 'Value'
window_name = 'contour'

def threshold(val):
    #0: Binary
    #1: Binary Inverted
    #2: Threshold Truncated
    #3: Threshold to Zero
    #4: Threshold to Zero Inverted
    # threshold_type = cv2.getTrackbarPos(trackbar_type, window_name)
    # threshold_value = cv2.getTrackbarPos(trackbar_value, window_name)
    _, dst = cv2.threshold(frame, threshold_value, max_binary_value, threshold_type )
    # cv2.imshow(window_name, dst)
    return dst




erosion_size = 0
max_elem = 2
max_kernel_size = 21
title_trackbar_element_shape = 'Element:\n 0: Rect \n 1: Cross \n 2: Ellipse'
title_trackbar_element_shape2 = 'Element2:\n 0: Rect \n 1: Cross \n 2: Ellipse'
title_trackbar_kernel_size = 'Kernel size:\n 2n +1'
title_trackbar_kernel_size2 = 'Kernel size2:\n 2n +1'


# optional mapping of values with morphological shapes
def morph_shape(val):
    if val == 0:
        return cv2.MORPH_RECT
    elif val == 1:
        return cv2.MORPH_CROSS
    elif val == 2:
        return cv2.MORPH_ELLIPSE
def erosion(val):
    erosion_size = cv2.getTrackbarPos(title_trackbar_kernel_size, window_name)
    erosion_shape = morph_shape(cv2.getTrackbarPos(title_trackbar_element_shape, window_name))
    
    element = cv2.getStructuringElement(erosion_shape, (2 * erosion_size + 1, 2 * erosion_size + 1),
                                       (erosion_size, erosion_size))
    
    erosion_dst = cv2.erode(frame, element)
    # cv2.imshow(window_name, erosion_dst)
    return erosion_dst

def dilatation(val):
    dilatation_size = cv2.getTrackbarPos(title_trackbar_kernel_size, window_name)
    dilation_shape = morph_shape(cv2.getTrackbarPos(title_trackbar_element_shape, window_name))
    element = cv2.getStructuringElement(dilation_shape, (2 * dilatation_size + 1, 2 * dilatation_size + 1),
                                       (dilatation_size, dilatation_size))
    dilatation_dst = cv2.dilate(frame, element)
    # cv2.imshow(window_name, dilatation_dst)
    return dilatation_dst




# --------- CONFIG --------------
NAME = "depthai"
jws = JSONWebSocketClient(NAME, config.socket)

# -------- OPEN CONNECTION ------
jws.connect()





# function to display the coordinates of
# of the points clicked on the image
def click_event(event, x, y, flags, params):
 
    # checking for left mouse clicks
    if event == cv2.EVENT_LBUTTONDOWN:
 
        # displaying the coordinates
        # on the Shell
        print(x, ' ', y)
 
        # displaying the coordinates
        # on the image window
        font = cv2.FONT_HERSHEY_SIMPLEX
        cv2.putText(frame, str(x) + ',' +
                    str(y), (x,y), font,
                    1, (255, 0, 0), 2)
        cv2.imshow(window_name, frame)
 
    # checking for right mouse clicks    
    if event==cv2.EVENT_RBUTTONDOWN:
 
        # displaying the coordinates
        # on the Shell
        
 
        # displaying the coordinates
        # on the image window
        font = cv2.FONT_HERSHEY_SIMPLEX
        depth = frame[y, x]
        print(x, ' ', y, ' ', depth)
     
        cv2.putText(frame, str(depth),
                    (x,y), font, 1,
                    (255, 255, 0), 2)
        cv2.imshow(window_name, frame)

# Connect to device and start pipeline
with dai.Device(pipeline) as device:

    # Output queue will be used to get the disparity frames from the outputs defined above
    q = device.getOutputQueue(name="disparity", maxSize=4, blocking=False)
    

    while True:
        inDisparity = q.get()  # blocking call, will wait until a new data has arrived
        frame = inDisparity.getFrame()
        # Normalization for better visualization
        frame = (frame * (255 / depth.initialConfig.getMaxDisparity())).astype(np.uint8)

        cv2.imshow("disparity", frame)
        cv2.setMouseCallback('disparity', click_event)

        # Threshold
        cv2.namedWindow(window_name)


        
        

        if CALIBRATED:
            # Shelf Removal
            _, frame = cv2.threshold(frame, SHELF, max_binary_value, cv2.THRESH_TOZERO_INV )
            _, frame = cv2.threshold(frame, BACKGROUND, max_binary_value, cv2.THRESH_TOZERO )

        
            # EROSION TO REMOVE SPECKLE
            erosion_size = 4
            element = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * erosion_size + 1, 2 * erosion_size + 1),
                                           (erosion_size, erosion_size))
            frame = cv2.erode(frame, element)

            # DILATION TO REFINE FIGURE
            dilatation_size = 3
            element = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * dilatation_size + 1, 2 * dilatation_size + 1),
                                           (dilatation_size, dilatation_size))
            frame = cv2.dilate(frame, element)

           
            contours, hierarchy = cv2.findContours(image=frame, mode=cv2.RETR_TREE, method=cv2.CHAIN_APPROX_NONE)

            # image_copy = image.copy()
            cv2.drawContours(image=frame, contours=contours, contourIdx=-1, color=(0, 255, 0), thickness=2, lineType=cv2.LINE_AA)
            
            

            if len(contours) != 0:
                # draw in blue the contours that were founded
                cv2.drawContours(frame, contours, -1, 255, 3)

                # find the biggest countour (c) by the area
                c = max(contours, key = cv2.contourArea)
                x,y,w,h = cv2.boundingRect(c)

                # draw the biggest contour (c) in green
                cv2.rectangle(frame,(x,y),(x+w,y+h),(0,255,0),2)

                # SEND A MESSAGE
                jws.send_event("contour", {"data": c.tolist()})

            cv2.imshow(window_name, frame)
        # Available color maps: https://docs.opencv.org/3.4/d3/d50/group__imgproc__colormap.html
        # frame = cv2.applyColorMap(frame, cv2.COLORMAP_JET)
        # cv2.imshow("disparity_color", frame)

        if cv2.waitKey(100) == ord('q'):
            break