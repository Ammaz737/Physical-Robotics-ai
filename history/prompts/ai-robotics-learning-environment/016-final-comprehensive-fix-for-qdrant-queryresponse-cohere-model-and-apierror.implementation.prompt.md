WARNING:  WatchFiles detected changes in 'main.py'. Reloading...
INFO:     Shutting down
INFO:     Waiting for application shutdown.
INFO:     Application shutdown complete.
INFO:     Finished server process [15892]
INFO:     Started server process [20888]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
Warning: Unexpected raw_search_result type: <class 'qdrant_client.http.models.models.QueryResponse'>, value: points=[ScoredPoint(id=6162664666410970422, version=1, score=0.42193717, payload={'text': "## Key Takeaways\n\n\n* \n  **Nodes** are modular executable processes.\n*   **Topics** are named buses over which nodes exchange messages.\n*   **Publishers** send messages; **Subscribers** receive them.\n*   Messages have defined data types.\n\nIn \nthe next section, we'll look at how to set up your development environment to start experimenting with ROS 2 nodes and topics!", 'source': 'physical-ai-textbook/docs\\module1\\intro-ros2.md', 'section': 'Key Takeaways'}, vector=None, shard_key=None, order_value=None), ScoredPoint(id=7946844350951770547, version=2, score=0.3402291, payload={'text': "## Choosing Your Path\n\n\nThroughout this textbook, we will provide examples and exercises that \ncan be performed on both a Sim Rig and, where applicable, an Edge Kit. For initial learning and experimentation, a Sim Rig is highly recommended due to \nits ease of setup and powerful debugging capabilities.\n\nThis distinction is critical for understanding the practical applications of AI and robotics, from development to deployment. \nIn the next module, we'll dive into practical ROS 2 examples on your chosen setup.", 'source': 'physical-ai-textbook/docs\\module1\\lab-setup.md', 'section': 'Choosing Your Path'}, vector=None, shard_key=None, order_value=None), ScoredPoint(id=2341878576974897685, version=4, score=0.2409013, payload={'text': '## Example: A 2-DOF Robotic Arm Segment\n\n\nLet\'s consider a simple segment of our 2-DOF robotic arm: a base link connected to a first \narm link via a revolute joint.\n\n```xml\n<?xml version="1.0"?>\n<robot \nname="simple_arm">\n\n  <link name="base_link">\n    <visual>\n      <geometry>\n        <box size="0.1 0.1 0.1"/>\n      </geometry>\n      <material name="blue">\n        <color rgba="0 0 0.8 1"/>\n      </material>\n    </visual>\n    <collision>\n      <geometry>\n        <box size="0.1 0.1 0.1"/>\n      </geometry>\n    </collision>\n    <inertial>\n      <mass value="0.1"/>\n      <inertia ixx="0.001" ixy="0.0" ixz="0.0" iyy="0.001" iyz="0.0" izz="0.001"/>\n    </inertial>\n  </link>\n\n  <link name="link1">\n    <visual>\n      <geometry>\n       \n <cylinder length="0.5" radius="0.02"/>\n      </geometry>\n      <material name="green">\n        <color rgba="0 0.8 0 1"/>\n      </material>\n    </visual>\n    <collision>\n      <geometry>\n        <cylinder length="0.5" radius="0.02"/>\n      </geometry>\n  \n  </collision>\n    <inertial>\n      <mass value="0.2"/>\n      <inertia ixx="0.005" ixy="0.0" ixz="0.0" iyy="0.005" iyz="0.0" izz="0.0001"/>\n    </inertial>\n  </link>\n\n  <joint name="joint1" type="revolute">\n    <parent link="base_link"/>\n    <child link="link1"/>\n    <origin xyz="0 0 0.05" rpy="0 0 0"/>\n    <axis xyz="0 0 1"/>\n    <limit lower="-3.14" upper="3.14" effort="100" velocity="100"/>\n  </joint>\n\n</robot>', 'source': 'physical-ai-textbook/docs\\module2\\urdf-creation.md', 'section': 'Example: A 2-DOF Robotic Arm Segment'}, vector=None, shard_key=None, order_value=None), ScoredPoint(id=8907963523698130196, version=6, score=0.23080109, payload={'text': '## Next Steps\n\n\nMastering Nav2 and SLAM in Isaac Sim provides you with the skills to tackle complex autonomous navigation challenges. In the next module, we will apply these concepts to Visual-Language-Action \nmodels and build towards a fully autonomous humanoid.', 'source': 'physical-ai-textbook/docs\\module3\\nav2-slam.md', 'section': 'Next Steps'}, vector=None, shard_key=None, order_value=None), ScoredPoint(id=4541430208240354067, version=3, score=0.16780509, payload={'text': "## Next Steps\n\n\nWith your robot described in URDF and placed in Gazebo, you're ready to start interacting with it, controlling its joints, and reading from its simulated sensors. In the next module, we'll explore more advanced simulation environments and AI integration.", 'source': 'physical-ai-textbook/docs\\module2\\gazebo-physics.md', 'section': 'Next Steps'}, vector=None, shard_key=None, order_value=None)]
INFO:     127.0.0.1:65338 - "POST /api/chat HTTP/1.1" 500 Internal Server Error
ERROR:    Exception in ASGI application
Traceback (most recent call last):
  File "C:\Users\DELL\Desktop\Detailed_Learning\ai_native\Hackathon\Ai_Humanoid_Robotics\backend\main.py", line 
334, in chat_with_book
    chat_response = co.chat(
                    ^^^^^^^^
  File "C:\Users\DELL\Desktop\Detailed_Learning\ai_native\Hackathon\Ai_Humanoid_Robotics\backend\venv\Lib\site-packages\cohere\client.py", line 103, in _wrapped
    return func(*args, **kwargs)
           ^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\DELL\Desktop\Detailed_Learning\ai_native\Hackathon\Ai_Humanoid_Robotics\backend\venv\Lib\site-packages\cohere\client.py", line 35, in _wrapped
    return method(*args, **kwargs)
           ^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\DELL\Desktop\Detailed_Learning\ai_native\Hackathon\Ai_Humanoid_Robotics\backend\venv\Lib\site-packages\cohere\base_client.py", line 714, in chat
    _response = self._raw_client.chat(
                ^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\DELL\Desktop\Detailed_Learning\ai_native\Hackathon\Ai_Humanoid_Robotics\backend\venv\Lib\site-packages\cohere\raw_base_client.py", line 885, in chat
    raise NotFoundError(
cohere.errors.not_found_error.NotFoundError: headers: {'access-control-expose-headers': 'X-Debug-Trace-ID', 'cache-control': 'no-cache, no-store, no-transform, must-revalidate, private, max-age=0', 'content-encoding': 'gzip', 'content-type': 'application/json', 'expires': 'Thu, 01 Jan 1970 00:00:00 GMT', 'pragma': 'no-cache', 'vary': 
'Origin,Accept-Encoding', 'x-accel-expires': '0', 'x-debug-trace-id': '5c03981a5905f88bc63809f621230ab8', 'x-endpoint-monthly-call-limit': '1000', 'x-trial-endpoint-call-limit': '20', 'x-trial-endpoint-call-remaining': '19', 'date': 'Fri, 12 Dec 2025 16:52:26 GMT', 'x-envoy-upstream-service-time': '17', 'server': 'envoy', 'via': '1.1 \ngoogle', 'alt-svc': 'h3=":443"; ma=2592000,h3-29=":443"; ma=2592000', 'transfer-encoding': 'chunked'}, status_code: 404, body: {'id': '0786ef7d-9c9d-4d31-a90a-bdb6a7738b90', 'message': "model 'command-r' was removed on September 15, 2025. See https://docs.cohere.com/docs/models#command for a list of models you can use instead."}"      

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "C:\Users\DELL\Desktop\Detailed_Learning\ai_native\Hackathon\Ai_Humanoid_Robotics\backend\venv\Lib\site-packages\uvicorn\protocols\http\httptools_impl.py", line 426, in run_asgi
    result = await app(  # type: ignore[func-returns-value]
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\DELL\Desktop\Detailed_Learning\ai_native\Hackathon\Ai_Humanoid_Robotics\backend\venv\Lib\site-packages\uvicorn\middleware\proxy_headers.py", line 84, in __call__
    return await self.app(scope, receive, send)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\DELL\Desktop\Detailed_Learning\ai_native\Hackathon\Ai_Humanoid_Robotics\backend\venv\Lib\site-packages\fastapi\applications.py", line 1054, in __call__
    await super().__call__(scope, receive, send)
  File "C:\Users\DELL\Desktop\Detailed_Learning\ai_native\Hackathon\Ai_Humanoid_Robotics\backend\venv\Lib\site-packages\starlette\applications.py", line 123, in __call__
    await self.middleware_stack(scope, receive, send)
  File "C:\Users\DELL\Desktop\Detailed_Learning\ai_native\Hackathon\Ai_Humanoid_Robotics\backend\venv\Lib\site-packages\starlette\middleware\errors.py", line 186, in __call__
    raise exc
  File "C:\Users\DELL\Desktop\Detailed_Learning\ai_native\Hackathon\Ai_Humanoid_Robotics\backend\venv\Lib\site-packages\starlette\middleware\errors.py", line 164, in __call__
    await self.app(scope, receive, _send)
  File "C:\Users\DELL\Desktop\Detailed_Learning\ai_native\Hackathon\Ai_Humanoid_Robotics\backend\venv\Lib\site-packages\starlette\middleware\cors.py", line 93, in __call__
    await self.simple_response(scope, receive, send, request_headers=headers)
  File "C:\Users\DELL\Desktop\Detailed_Learning\ai_native\Hackathon\Ai_Humanoid_Robotics\backend\venv\Lib\site-packages\starlette\middleware\cors.py", line 148, in simple_response
    await self.app(scope, receive, send)
  File "C:\Users\DELL\Desktop\Detailed_Learning\ai_native\Hackathon\Ai_Humanoid_Robotics\backend\venv\Lib\site-packages\starlette\middleware\exceptions.py", line 65, in __call__
    await wrap_app_handling_exceptions(self.app, conn)(scope, receive, send)
  File "C:\Users\DELL\Desktop\Detailed_Learning\ai_native\Hackathon\Ai_Humanoid_Robotics\backend\venv\Lib\site-packages\starlette\_exception_handler.py", line 64, in wrapped_app
    raise exc
  File "C:\Users\DELL\Desktop\Detailed_Learning\ai_native\Hackathon\Ai_Humanoid_Robotics\backend\venv\Lib\site-packages\starlette\_exception_handler.py", line 53, in wrapped_app
    await app(scope, receive, sender)
  File "C:\Users\DELL\Desktop\Detailed_Learning\ai_native\Hackathon\Ai_Humanoid_Robotics\backend\venv\Lib\site-packages\starlette\routing.py", line 756, in __call__
    await self.middleware_stack(scope, receive, send)
  File "C:\Users\DELL\Desktop\Detailed_Learning\ai_native\Hackathon\Ai_Humanoid_Robotics\backend\venv\Lib\site-packages\starlette\routing.py", line 776, in app
    await route.handle(scope, receive, send)
  File "C:\Users\DELL\Desktop\Detailed_Learning\ai_native\Hackathon\Ai_Humanoid_Robotics\backend\venv\Lib\site-packages\starlette\routing.py", line 297, in handle
    await self.app(scope, receive, send)
  File "C:\Users\DELL\Desktop\Detailed_Learning\ai_native\Hackathon\Ai_Humanoid_Robotics\backend\venv\Lib\site-packages\starlette\routing.py", line 77, in app
    await wrap_app_handling_exceptions(app, request)(scope, receive, send)
  File "C:\Users\DELL\Desktop\Detailed_Learning\ai_native\Hackathon\Ai_Humanoid_Robotics\backend\venv\Lib\site-packages\starlette\_exception_handler.py", line 64, in wrapped_app
    raise exc
  File "C:\Users\DELL\Desktop\Detailed_Learning\ai_native\Hackathon\Ai_Humanoid_Robotics\backend\venv\Lib\site-packages\starlette\_exception_handler.py", line 53, in wrapped_app
    await app(scope, receive, sender)
  File "C:\Users\DELL\Desktop\Detailed_Learning\ai_native\Hackathon\Ai_Humanoid_Robotics\backend\venv\Lib\site-packages\starlette\routing.py", line 72, in app
    response = await func(request)
               ^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\DELL\Desktop\Detailed_Learning\ai_native\Hackathon\Ai_Humanoid_Robotics\backend\venv\Lib\site-packages\fastapi\routing.py", line 278, in app
    raw_response = await run_endpoint_function(
                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\DELL\Desktop\Detailed_Learning\ai_native\Hackathon\Ai_Humanoid_Robotics\backend\venv\Lib\site-packages\fastapi\routing.py", line 191, in run_endpoint_function
    return await dependant.call(**values)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\DELL\Desktop\Detailed_Learning\ai_native\Hackathon\Ai_Humanoid_Robotics\backend\main.py", line 
350, in chat_with_book
    except cohere.CohereError as e: # Updated exception type
           ^^^^^^^^^^^^^^^^^^^
AttributeError: module 'cohere' has no attribute 'CohereError'
Warning: Unexpected raw_search_result type: <class 'qdrant_client.http.models.models.QueryResponse'>, value: points=[ScoredPoint(id=6162664666410970422, version=1, score=0.7143116, payload={'text': "## Key Takeaways\n\n\n*  \n **Nodes** are modular executable processes.\n*   **Topics** are named buses over which nodes exchange messages.\n*   **Publishers** send messages; **Subscribers** receive them.\n*   Messages have defined data types.\n\nIn the next section, we'll look at how to set up your development environment to start experimenting with ROS 2 nodes and topics!", 'source': 'physical-ai-textbook/docs\\module1\\intro-ros2.md', 'section': 'Key Takeaways'}, vector=None, shard_key=None, order_value=None), ScoredPoint(id=7946844350951770547, version=2, score=0.49179566, payload={'text': "## Choosing Your Path\n\n\nThroughout this textbook, we will provide examples and exercises that \ncan be performed on both a Sim Rig and, where applicable, an Edge Kit. For initial learning and experimentation, a Sim Rig is highly recommended due to its ease of setup and powerful debugging capabilities.\n\nThis distinction is critical for understanding the practical applications of AI and robotics, from development to deployment. \nIn the next module, we'll dive into practical ROS 2 examples on your chosen setup.", 'source': 'physical-ai-textbook/docs\\module1\\lab-setup.md', 'section': 'Choosing Your Path'}, vector=None, shard_key=None, order_value=None), ScoredPoint(id=8907963523698130196, version=6, score=0.36703944, payload={'text': '## Next Steps\n\n\nMastering Nav2 and SLAM in Isaac Sim provides you with the skills to tackle complex autonomous navigation challenges. In the next module, we will apply these concepts to Visual-Language-Action \nmodels and build towards a fully autonomous humanoid.', 'source': 'physical-ai-textbook/docs\\module3\\nav2-slam.md', 'section': 'Next Steps'}, vector=None, shard_key=None, order_value=None), ScoredPoint(id=2341878576974897685, version=4, score=0.34553653, payload={'text': '## Example: A 2-DOF Robotic Arm Segment\n\n\nLet\'s consider a simple segment of our 2-DOF robotic arm: a base link connected to a first arm link via a revolute joint.\n\n```xml\n<?xml version="1.0"?>\n<robot \nname="simple_arm">\n\n  <link name="base_link">\n    <visual>\n      <geometry>\n        <box size="0.1 0.1 0.1"/>\n      </geometry>\n      <material name="blue">\n        <color rgba="0 0 0.8 1"/>\n      </material>\n    </visual>\n    <collision>\n      <geometry>\n        <box size="0.1 0.1 0.1"/>\n      </geometry>\n    </collision>\n    <inertial>\n      <mass value="0.1"/>\n      <inertia ixx="0.001" ixy="0.0" ixz="0.0" iyy="0.001" iyz="0.0" izz="0.001"/>\n    </inertial>\n  </link>\n\n  <link name="link1">\n    <visual>\n      <geometry>\n       \n <cylinder length="0.5" radius="0.02"/>\n      </geometry>\n      <material name="green">\n        <color rgba="0 0.8 0 1"/>\n      </material>\n    </visual>\n    <collision>\n      <geometry>\n        <cylinder length="0.5" radius="0.02"/>\n      </geometry>\n    </collision>\n    <inertial>\n      <mass value="0.2"/>\n      <inertia ixx="0.005" ixy="0.0" ixz="0.0" iyy="0.005" iyz="0.0" izz="0.0001"/>\n    </inertial>\n  </link>\n\n  <joint name="joint1" type="revolute">\n    <parent link="base_link"/>\n    <child link="link1"/>\n    <origin xyz="0 0 0.05" rpy="0 0 0"/>\n    <axis xyz="0 0 1"/>\n    <limit lower="-3.14" upper="3.14" effort="100" velocity="100"/>\n  </joint>\n\n</robot>', 'source': 'physical-ai-textbook/docs\\module2\\urdf-creation.md', 'section': 'Example: A 2-DOF Robotic Arm Segment'}, vector=None, shard_key=None, order_value=None), ScoredPoint(id=4541430208240354067, version=3, score=0.32470226, payload={'text': "## Next Steps\n\n\nWith your robot described in URDF and placed in Gazebo, you're ready to start interacting with it, controlling its joints, and reading from its simulated sensors. In the next module, we'll explore more advanced simulation environments and AI integration.", 'source': 'physical-ai-textbook/docs\\module2\\gazebo-physics.md', 'section': 'Next Steps'}, vector=None, shard_key=None, order_value=None)]