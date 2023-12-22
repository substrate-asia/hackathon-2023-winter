package Model.blend;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;


import com.example.blend.R;
import com.firebase.ui.auth.AuthMethodPickerLayout;
import com.firebase.ui.auth.AuthUI;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.Arrays;
import java.util.List;

public class SignInSignUpActivity extends AppCompatActivity {
    private static final String TAG = "SignInSignUpActivity";
    private static final int RC_SIGN_IN = 123;


    private FirebaseAuth mAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.signin);
        setContentView(R.layout.signin);
        mAuth = FirebaseAuth.getInstance();

        Button btnSignIn = findViewById(R.id.btnSignIn);
        Button btnSignUp = findViewById(R.id.btnSignUp);

        btnSignIn.setOnClickListener(v -> signInWithGoogle(RC_SIGN_IN));
        btnSignUp.setOnClickListener(v -> signInWithGoogle(RC_SIGN_IN));
    }

    @Override
    protected void onStart() {
        super.onStart();
        FirebaseUser currentUser = mAuth.getCurrentUser();
        if (currentUser != null) {
            checkUserExistsInFirestore(currentUser.getUid());
        }
    }

    //google signin function
    private void signInWithGoogle(int requestCode) {
        List<AuthUI.IdpConfig> providers = Arrays.asList(
                new AuthUI.IdpConfig.GoogleBuilder()
                        .build()
        );

        AuthMethodPickerLayout customLayout = new AuthMethodPickerLayout
                .Builder(R.layout.signin)
                .setGoogleButtonId(R.id.btnSignIn)
                .build();

        startActivityForResult(
                AuthUI.getInstance()
                        .createSignInIntentBuilder()
                        .setAvailableProviders(providers)
                        .setAuthMethodPickerLayout(customLayout)
                        .build(),
                requestCode);
    }

    //on response from google
    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (resultCode == RESULT_OK) {
            // If Sign-in successful
            FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
            if (user != null) {
                Log.d(TAG, "User signed in: " + user.getDisplayName());
                checkUserExistsInFirestore(user.getUid());
            } else {
                Log.w(TAG, "User is null after sign-in");

            }
        }
    }

    //Function to check existing user
    private void checkUserExistsInFirestore(String userId) {
        FirebaseFirestore db = FirebaseFirestore.getInstance();
        db.collection("users")
                .document(userId)
                .get()
                .addOnCompleteListener(task -> {
                    if (task.isSuccessful()) {
                        DocumentSnapshot document = task.getResult();
                        if (document != null && document.exists()) {

                            proceedToNextActivity(ProfileActivity.class);
                        } else {
                            proceedToNextActivity(NicknameActivity.class);
                        }
                    } else {
                        Log.e(TAG, "Error checking user in Firestore", task.getException());
                    }
                });
    }
    //Function to move to next activity if user not exists
    private void proceedToNextActivity(Class<?> destinationActivity) {
        Intent intent = new Intent(this, destinationActivity);
        startActivity(intent);
        finish();
    }

}
