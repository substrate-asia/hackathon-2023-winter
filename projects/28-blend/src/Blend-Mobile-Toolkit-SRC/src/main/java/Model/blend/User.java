package Model.blend;

public class User {
    private String userId; // This field is typically used as the key in the database
    private String nickname;

    public User() {

    }


    public User(String uid,  String nickname) {
        this.userId = uid;

        this.nickname = nickname;
    }


    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }


    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }
}
